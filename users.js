const dashboardNames = {
  EMBED_ID1: "Customer Acquisition Analysis",
  EMBED_ID2: "CONVERSION ANALYSIS",
  EMBED_ID3: "INVENTORY ANALYSIS",
  EMBED_ID4: "CUSTOMER RETENTION ANALYSIS",
  EMBED_ID5: "CUSTOMER ENGAGEMENT ANALYSIS",
  EMBED_ID6: "STORE PERFORMANCE ANALYSIS",
  EMBED_ID7: "PRODUCT PERFORMANCE ANALYSIS",
  EMBED_ID8: "REPURCHASE ANALYSIS",
  EMBED_ID9: "MARKET INTELLIGENCE ANALYSIS",
  EMBED_ID10: "EXECUTIVE SUMMARY",
};

module.exports = [
  {
    username: "ajay",
    config: {
      visualization1: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID1,
        title: dashboardNames["EMBED_ID1"],
        filters: [
            {
              "column": "Traffic Source",
              "values": [
                  "Instagram"
              ],
              "operator": "IN",
            },
          ],
      },
      visualization2: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID2,
        title: dashboardNames["EMBED_ID2"],
      },
      visualization3: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID3,
        title: dashboardNames["EMBED_ID3"],
      },
      visualization4: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID4,
        title: dashboardNames["EMBED_ID4"],
      },
      visualization5: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID5,
        title: dashboardNames["EMBED_ID5"],
      },
      visualization6: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID6,
        title: dashboardNames["EMBED_ID6"],
      },
    },
  },
  {
    username: "subash",
    config: {
      visualization1: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID1,
        title: dashboardNames["EMBED_ID1"], // Not mapped
        filters: [
            {
              "column": "Channel Type",
              "values": [
                  "email"
              ],
              "operator": "IN",
            }
          ],
      },
      visualization2: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID7,
        title: dashboardNames["EMBED_ID7"],
      },
      visualization3: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID8,
        title: dashboardNames["EMBED_ID8"],
      },
      visualization4: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID9,
        title: dashboardNames["EMBED_ID9"],
      },
    },
  },
  {
    username: "shashank",
    config: {
      visualization1: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID7,
        title: dashboardNames["EMBED_ID7"],
        filters: [],
      },
      visualization2: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID10,
        title: dashboardNames["EMBED_ID10"],
      },
      visualization3: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID1,
        title: dashboardNames["EMBED_ID1"],
      },
      visualization4: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID2,
        title: dashboardNames["EMBED_ID2"],
      },
    },
  },
  {
    username: "naveen",
    config: {
      visualization1: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID9,
        title: dashboardNames["EMBED_ID9"],
        filters: [],
      },
      visualization2: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID3,
        title: dashboardNames["EMBED_ID3"],
      },
      visualization3: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID4,
        title: dashboardNames["EMBED_ID4"],
      },
      visualization4: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID5,
        title: dashboardNames["EMBED_ID5"],
      },
    },
  },
  {
    username: "ajay.boobalakrishnan",
    config: {
      visualization1: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID1,
        title: dashboardNames["EMBED_ID1"],
        filters: [],
      },
      visualization2: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID6,
        title: dashboardNames["EMBED_ID6"],
      },
      visualization3: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID7,
        title: dashboardNames["EMBED_ID7"],
      },
      visualization4: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        embedId: process.env.EMBED_ID8,
        title: dashboardNames["EMBED_ID8"],
      },
    },
  },
];
