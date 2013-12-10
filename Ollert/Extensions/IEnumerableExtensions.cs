using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Core.Objects.DataClasses;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;

namespace Ollert
{
    public static class IEnumerableExtensions
    {       
        public static HashSet<T> ToHashSet<T>(this IEnumerable<T> source)
        {
            return new HashSet<T>(source);
        }
    }
}