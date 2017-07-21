using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace hidrocontroll.Areas.Functional
{
    public class DateTimeFunctional
    {
        static public int diferencaDeDias(DateTime d1, DateTime d2)
        {
            TimeSpan span = d1.Subtract(d2);
            return (int)span.TotalDays;
        }
    }
}