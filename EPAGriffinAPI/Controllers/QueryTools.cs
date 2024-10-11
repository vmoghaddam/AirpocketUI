using EPAGriffinAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
 
using Newtonsoft.Json.Linq;
using System.Linq.Dynamic;
using System.Web.Http.ModelBinding;
using DevExtreme.AspNet.Data.Helpers;
using System.Web.Http.Controllers;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.Aggregation;

namespace EPAGriffinAPI.Controllers
{
    public static class QueryHelper
    {

        public static IEnumerable<RptFuelLeg> PageByOptions(this IEnumerable<RptFuelLeg> query, Dictionary<string, object> options)
        {
            if (options.ContainsKey("skip"))
            {
                var skip = Convert.ToInt32(options["skip"]);
                var take = Convert.ToInt32(options["take"]);
                query = query
                    .Skip(skip)
                    .Take(take);
            }
            return query;
        }

        public static IEnumerable<RptFuelLeg> SortByOptions(this IEnumerable<RptFuelLeg> query, Dictionary<string, object> options)
        {
            if (options.ContainsKey("sortOptions") && options["sortOptions"] != null)
            {
                var sortOptions = JObject.Parse(JArray.FromObject(options["sortOptions"])[0].ToString());
                var columnName = (string)sortOptions.SelectToken("selector");
                var descending = (bool)sortOptions.SelectToken("desc");

                if (descending)
                    columnName += " DESC";
                query = query.OrderBy(columnName);
            }
            return query;
        }


        public static IEnumerable<RptFuelLeg> FilterByOptions(this IEnumerable<RptFuelLeg> query, Dictionary<string, object> options)
        {
            if (options.ContainsKey("filterOptions") && options["filterOptions"] != null)
            {
                var filterTree = JArray.FromObject(options["filterOptions"]);
                return ReadExpression(query, filterTree);
            }
            return query;
        }

        public static IEnumerable<RptFuelLeg> ReadExpression(IEnumerable<RptFuelLeg> source, JArray array)
        {
            if (array[0].Type == JTokenType.String)
                return FilterQuery(source,
                    array[0].ToString(),
                    array[1].ToString(),
                    array[2].ToString());
            else
            {
                for (int i = 0; i < array.Count; i++)
                {
                    if (array[i].ToString().Equals("and"))
                        continue;
                    source = ReadExpression(source, (JArray)array[i]);
                }
                return source;
            }
        }

        public static IEnumerable<RptFuelLeg> FilterQuery(IEnumerable<RptFuelLeg> source, string ColumnName, string Clause, string Value)
        {
            switch (Clause)
            {
                case "=":
                    Value = System.Text.RegularExpressions.Regex.IsMatch(Value, @"^\d+$") ? Value : String.Format("\"{0}\"", Value);
                    source = source.Where(String.Format("{0} == {1}", ColumnName, Value));
                    break;
                case "contains":
                    source = source.Where(ColumnName + ".Contains(@0)", Value);
                    break;
                case "<>":
                    source = source.Where(string.Format("!{0}.StartsWith(\"{1}\")", ColumnName, Value));
                    break;
                default:
                    break;
            }
            return source;
        }
    }

    [ModelBinder(typeof(DataSourceLoadOptionsHttpBinder))]
    public class DataSourceLoadOptions : DataSourceLoadOptionsBase { }

    class DataSourceLoadOptionsHttpBinder : IModelBinder
    {

        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            var loadOptions = new DataSourceLoadOptions();
            DataSourceLoadOptionsParser.Parse(loadOptions, key => bindingContext.ValueProvider.GetValue(key)?.AttemptedValue);
            bindingContext.Model = loadOptions;
            return true;
        }

    }
    class RPKAggregator<T> : Aggregator<T>
    {
        decimal? _paxDistance = 0;
        decimal? _usedFuel = 0;

        public RPKAggregator(IAccessor<T> accessor)
            : base(accessor)
        {
        }

        public override void Step(T container, string selector)
        {//PaxDistanceKM
            if (Accessor.Read(container, "PaxDistanceKM") != null)
                _paxDistance += Convert.ToDecimal(Accessor.Read(container, "PaxDistanceKM"));
            _usedFuel += Convert.ToDecimal(Accessor.Read(container, "Used"));
           
        }

        public override object Finish()
        {
            return _paxDistance == 0 ? null : _paxDistance / _usedFuel;
        }
    }
}