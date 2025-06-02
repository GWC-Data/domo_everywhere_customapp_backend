const CLIENT_ID = "207f756f-9690-4a66-80ae-992bde75d1d9";
const CLIENT_SECRET =
  "b821973dc36379d347786ea34a7c226f8743722f18d234bb4a4c4eebfe27eae4";
const EMBED_ID = "gpyL9";
const EMBED_CUSTOM_ID1 = "gpyL9";
const EMBED_CUSTOM_ID2 = "363j9";
const EMBED_CUSTOM_ID3 = "OgGEQ";
const EMBED_TYPE = "card";

module.exports = [
  {
    username: "nandha",
    email: "nandha.kumar@gwcdata.ai",
    config: {
      visualization1: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        embedId: EMBED_CUSTOM_ID1,
        title: "Accor User",
        header: "CustomApplication",
        filters: [],
      },
      visualization2: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        embedId: EMBED_CUSTOM_ID2,
        title: "Accor Admin",
        header: "CustomApplication",
        filters: [],
      },
      visualization3: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        embedId: EMBED_CUSTOM_ID3,
        title: "Marry Brown",
        header: "CustomApplication",
        filters: [],
      },
    },
  },
];
