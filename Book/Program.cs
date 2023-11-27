using Book.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
            //.AddGoogle(options =>
            //{
            //    options.SaveTokens = true;

            //    options.ClientId = "485947985520-2929tagfo657ogj3ghljgq3e51rle2em.apps.googleusercontent.com";
            //    options.ClientSecret = "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";
            //});

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
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

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