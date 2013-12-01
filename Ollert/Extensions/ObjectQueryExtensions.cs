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
    public static class ObjectQueryExtensions
    {
        public static ObjectQuery<T> Includes<T>(this ObjectQuery<T> query, Action<IncludeObjectQuery<T, T>> action)
        {
            var sb = new StringBuilder();
            var queryBuilder = new IncludeObjectQuery<T, T>(query, sb);
            action(queryBuilder);
            return queryBuilder.Query;
        }

        public static ObjectQuery<TEntity> Include<TEntity, TProperty>(this ObjectQuery<TEntity> query, Expression<Func<TEntity, TProperty>> expression)
        {
            var sb = new StringBuilder();
            return IncludeAllLevels(expression, sb, query);
        }

        static ObjectQuery<TQuery> IncludeAllLevels<TEntity, TProperty, TQuery>(Expression<Func<TEntity, TProperty>> expression, StringBuilder sb, ObjectQuery<TQuery> query)
        {
            foreach (var name in expression.GetPropertyLevels())
            {
                sb.Append(name);
                query = query.Include(sb.ToString());
                //Debug.WriteLine(string.Format("Include(\"{0}\")", sb));
                sb.Append('.');
            }
            return query;
        }

        static IEnumerable<string> GetPropertyLevels<TClass, TProperty>(this Expression<Func<TClass, TProperty>> expression)
        {
            var namesInReverse = new List<string>();

            var unaryExpression = expression as UnaryExpression;
            var body = unaryExpression != null ? unaryExpression.Operand : expression.Body;

            while (body != null)
            {
                var memberExpression = body as MemberExpression;
                if (memberExpression == null)
                    break;

                namesInReverse.Add(memberExpression.Member.Name);
                body = memberExpression.Expression;
            }

            namesInReverse.Reverse();
            return namesInReverse;
        }

        public class IncludeObjectQuery<TQuery, T>
        {
            readonly StringBuilder _pathBuilder;
            public ObjectQuery<TQuery> Query { get; private set; }

            public IncludeObjectQuery(ObjectQuery<TQuery> query, StringBuilder builder)
            {
                _pathBuilder = builder;
                Query = query;
            }

            public IncludeObjectQuery<TQuery, U> Include<U>(Expression<Func<T, U>> expression)
            {
                Query = ObjectQueryExtensions.IncludeAllLevels(expression, _pathBuilder, Query);
                return new IncludeObjectQuery<TQuery, U>(Query, _pathBuilder);
            }

            public IncludeObjectQuery<TQuery, U> Include<U>(Expression<Func<T, EntityCollection<U>>> expression) where U : class
            {
                Query = ObjectQueryExtensions.IncludeAllLevels(expression, _pathBuilder, Query);
                return new IncludeObjectQuery<TQuery, U>(Query, _pathBuilder);
            }
        }
    }
}