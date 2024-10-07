using DevExpress.XtraReports.UI;
using DevExpress.XtraReports.Expressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DevExpress.Data.Filtering;

namespace Report
{

    public class MyCustomFunction : ICustomFunctionOperator
    {

        object ICustomFunctionOperator.Evaluate(params object[] operands)
        {
            // Insert your custom logic here.
            // For demonstration purposes, multiply an operand value to 10.
            return (Convert.ToDouble(operands[0]) * 10);
        }

        string ICustomFunctionOperator.Name
        {
            get { return "MyFunction"; }
        }

        Type ICustomFunctionOperator.ResultType(params Type[] operands)
        {
            return typeof(double);
        }
    }
}