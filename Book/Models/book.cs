using System;
using System.Collections.Generic;

namespace Book.Models
{
    public partial class book
    {
        public int BookId { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Genre { get; set; }
        public long? Isbn { get; set; }
        public DateTime? PublishDate { get; set; }
    }
}
