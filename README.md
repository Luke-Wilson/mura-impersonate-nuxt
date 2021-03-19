# mura-impersonate-nuxt
A package that allows a Mura super user to impersonate other Mura users.


## Before you start
Create a Mura-Nuxt project by following the instructions at https://github.com/murasoftware/mura-nuxtjs-decoupled.git

Once you have your Mura-Nuxt implementation working, you can follow the below steps.

## Getting started
1. Install mura-impersonate-nuxt into your nuxtjs directory
```
cd /path/to/nuxtjs
npm install --save mura-impersonate-nuxt
```

2. Download the tarball and extract it into your mura directory
```
cd /path/to/mura
tar xvzf /path/to/file/nuxtutils.tar
```

3. Adjust the CFMLServlet in your web.xml to include the custom API paths by adding this line: `<url-pattern>/nuxtutils/index.cfm/*</url-pattern>`:

```
<servlet-mapping>
	<servlet-name>CFMLServlet</servlet-name>
	<url-pattern>*.cfm</url-pattern>
	<url-pattern>*.cfml</url-pattern>
	<url-pattern>*.cfc</url-pattern>
	<url-pattern>/nuxtutils/index.cfm/*</url-pattern>
	<url-pattern>/index.cfm/*</url-pattern>
	<url-pattern>/index.cfc/*</url-pattern>
	<url-pattern>/index.cfml/*</url-pattern>
</servlet-mapping>
```

4. In the `mura` service within your `docker-compose.yml`, load in the new `nuxtutils` directory and `web.xml` file:
```
volumes:
	#- ../../mura/core:/var/www/core
	- ./nuxtutils:/var/www/nuxtutils
	- ./web.xml:/usr/local/tomcat/conf/web.xml
	- mura_nuxtjs_decoupled_plugins:/var/www/plugins
	- mura_nuxtjs_decoupled_themes:/var/www/themes
	- mura_nuxtjs_decoupled_sites:/var/www/sites
```

5. Start your Docker containers:
```
docker-compose up -d
```

6. Log in to Mura admin. In the site settings, create a new REST service called `s2usertoken`. Copy the generated "Basic ..." auth string for the `basicAuthS2Token` variable in the next step.

7. Create a `env` property in your `nuxt.config.js` file if you don't already have one. Add the following variables:
```
env: {
	rootpath: "http://localhost:8888",
	impersonateDomain: ".localhost",
	s2usertoken: "s2usertoken",
	basicAuthS2Token:
		"Basic ...authStringfromPreviousStep...",
}
```

8. In your `nuxt.config.js` add `mura-impersonate-nuxt` to the `modules` section:
```
modules: [
	"mura-impersonate-nuxt"
]

9. In your `nuxtjs` directory, create the `pages/impersonate.vue` page:
``` 
<template>
<div>
	<main role="main" class="container">
		<h1 class="mt-5">Impersonate a user</h1>
		<input v-model="targetUsername" type="text" />
		<p>Target: {{targetUsername}}</p>
		<button @click="$impersonateUser(targetUsername)">CLICK TO IMPERSONATE USER</button>
	</main>
</div>
</template>

<script>
export default {
	data() {
		return {
			targetUsername: "",
		}
	},
}
</script>

```

### Relevant directory structure
```
.
├── mura
│   ├── nuxtutils
│   │   ├── beans
│   │   │   └── nuxtUtilsService.cfc
│   │   └── index.cfm
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── web.xml
└── nuxtjs
    ├── pages
    │   ├── impersonate.vue
    │   └── index.vue
    └── nuxt.config.js
```