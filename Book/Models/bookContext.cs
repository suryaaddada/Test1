using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Book.Models
{
    public partial class bookContext : DbContext
    {
        public bookContext()
        {
        }

        public bookContext(DbContextOptions<bookContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admins { get; set; } = null!;
        public virtual DbSet<book> Books { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=10.3.117.39;Database=book;Integrated Security=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable("Admin");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Email)
                    .HasMaxLength(30)
                    .HasColumnName("email");

                entity.Property(e => e.Gender)
                    .HasMaxLength(6)
                    .HasColumnName("gender");

                entity.Property(e => e.Isadmin).HasColumnName("isadmin");

                entity.Property(e => e.Mobile).HasColumnName("mobile");

                entity.Property(e => e.Name)
                    .HasMaxLength(30)
                    .HasColumnName("name");

                entity.Property(e => e.Password)
                    .HasMaxLength(30)
                    .HasColumnName("password");
            });

            modelBuilder.Entity<book>(entity =>
            {
                entity.ToTable("book");

                entity.Property(e => e.Author).HasMaxLength(30);

                entity.Property(e => e.Genre).HasMaxLength(30);

                entity.Property(e => e.Isbn).HasColumnName("ISBN");

                entity.Property(e => e.PublishDate)
                    .HasColumnType("date")
                    .HasColumnName("publishDate");

                entity.Property(e => e.Title).HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
