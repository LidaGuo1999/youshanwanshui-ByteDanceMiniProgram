const app = getApp();

Page({
    data: {
        searchResults: app.searchResults,
        nodes: app.searchResults.nodes,
        strategies: app.searchResults.strategies
    },

    onLoad: function () {
        console.log('进入search-display页面');
        var tmpNodes = [], tmpStrategies = [];
        for (var i = 0; i < app.searchResults.nodes.length; i++) {
            tmpNodes.push({
                value: app.searchResults.nodes[i].split('_')[1],
                index: i
            });
        }
        for (var i = 0; i < app.searchResults.strategies.length; i++) {
            tmpStrategies.push({
                value: app.searchResults.strategies[i].split('_')[1],
                index: i
            });
        }
        this.setData({
            searchResults: app.searchResults,
            nodes: tmpNodes,
            strategies: tmpStrategies
        });
    },
    onShow: function () {
    },
    viewTap: function (event) {
        console.log(event);
        var index = event.target.dataset.index;
        if (event.target.dataset.genre == 'node') {
            var s = this.data.searchResults.nodes[index].split('_');
            var openid = s[0], name = s[1];
            app.searchOpenid = openid;
            app.currentNode = name;
            tt.navigateTo({
              url: '/pages/travel-display/travel-display' // 指定页面的url
            });
        } else if (event.target.dataset.genre == 'strategy') {
            var s = this.data.searchResults.strategies[index].split('_');
            var openid = s[0], name = s[1];
            app.searchOpenid = openid;
            app.currentStrategy = name;
            tt.navigateTo({
              url: '/pages/strategy-display/strategy-display' // 指定页面的url
            });
        }
    }
})
