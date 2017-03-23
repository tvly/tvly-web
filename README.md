# iptv

> A Vue.js based iptv frontend

## Config

The configurations should be put in `config.json`:

```json
{
	"baseUrl": "/beta/", # It should end with '/'
	"authUrl": "https://example.com/auth", # where to redirect when 403 is found
	"logoutUrl": "https://example.com/logout", # url used to logout
	"channelsUrl": "https://example.com/channels.json", # url to retrieve channel list
	"legacyUrl": "https://example.com/legacy", # url suitable for legacy browser
	"recommendedBrowser": "some browser", # recommended browser for users of legacy browser
	"supportingMailbox": "support@example.com"
}
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Credit

Thanks for the icon made by [Madebyoliver](http://www.flaticon.com/authors/madebyoliver).
