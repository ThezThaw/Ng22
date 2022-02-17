using System;
using System.Collections.Generic;

namespace Ng22.Backend
{
    public class StatusResult<T>
    {
        public bool status { get; set; }
        public T data { get; set; }
        public List<string> message { get; set; }
    }

    public class FilterRequest
    {
        public DateTime? dt { get; set; }
        public DateTime? fd { get; set; }
        public DateTime? td { get; set; }
        public string code { get; set; }
        public int? id { get; set; }
        public short? status { get; set; }
    }

    public class ResultWithMessage<T> where T : class
    {
        public List<T> lst { get; set; }
        public T vm { get; set; }
        public string msg { get; set; }
        public bool ok { get; set; }
    }
}
