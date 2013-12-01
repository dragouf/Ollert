using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using System.Text;

namespace Ollert
{
    public static class StringExtension
    {
        public static string FormatWith(this string target, params object[] args)
        {            
            return string.Format(target, args);
        }
    }
}