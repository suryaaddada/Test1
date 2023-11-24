using System;
using System.Collections.Generic;

namespace Book.Models
{
    public partial class Admin
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Gender { get; set; }
        public long? Mobile { get; set; }
        public bool? Isadmin { get; set; }
    }
}
