using Book.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Filters;
using System.Text;

namespace Book
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var configuration= new ConfigurationBuilder().SetBasePath(builder.Environment.ContentRootPath)
                .AddJsonFile("appsettings.json").Build();

            builder.Services.AddCors();
            builder.Services.AddDbContext<bookContext>(opt => opt.UseSqlServer(configuration.GetConnectionString("Data")));

            builder.Services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                var key = Encoding.UTF8.GetBytes(configuration["JWT:Key"]); 
                o.SaveToken = true;
                o.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = configuration["JWT:Audience"],
                    ValidIssuer = configuration["JWT:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                };
            });
            

            builder.Services.AddLogging(b =>
            {
            b.ClearProviders();

            Log.Logger = new LoggerConfiguration()
            .WriteTo.Logger(lc => lc.WriteTo.File("Serilog/log.txt", rollingInterval: RollingInterval.Day,
            outputTemplate:"{Timestamp:yyyy-MM-dd HH:mm:ss} Source={SourceContext} Message={Message}{NewLine}{Exception}"))

            .Filter.ByIncludingOnly(Matching.FromSource("Book")).MinimumLevel.Information().CreateLogger();
            });

            builder.Logging.AddSerilog();
            builder.Services.AddControllers();
            
            builder.Services.AddEndpointsApiExplorer();
           
            builder.Services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MyAPI", Version = "v1" });
                opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });

                opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();

            }

            app.UseHttpsRedirection();

            app.UseCors(builder => builder
            
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(origin => true)  // You can keep this line if it's necessary for your use case
            .AllowCredentials()
            );

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}