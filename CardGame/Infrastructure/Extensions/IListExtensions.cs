namespace CardGame.Infrastructure.Extensions
{
    using System;
    using System.Collections.Generic;

    public static class IListExtensions
    {
        public static IList<T> Shuffle<T>(this IList<T> list)
        {
            // Knuth-Fisher-Yates shuffle
            var random = new Random();
            for (int i = list.Count - 1; i > 0; i--)
            {
                int n = random.Next(i + 1);
                list.Swap(i, n);
            }
            return list;
        }

        public static IList<T> Swap<T>(this IList<T> list, int indexA, int indexB)
        {
            T temp = list[indexA];
            list[indexA] = list[indexB];
            list[indexB] = temp;
            return list;
        }
    }
}