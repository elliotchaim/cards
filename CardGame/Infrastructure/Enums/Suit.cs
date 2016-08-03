namespace CardGame.Infrastructure.Enums
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    [JsonConverter(typeof(StringEnumConverter))]
    public enum Suit
    {
        Hearts = 1,
        Diamonds = 2,
        Spades = 3,
        Clubs = 4
    }
}