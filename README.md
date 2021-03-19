# mura-impersonate-nuxt



## Getting started
1. Install mura-impersonate-nuxt into your nuxtjs directory
```
npm install --save mura-impersonate-nuxt
```

2. Unzip the nuxtutils.zip into your mura directory
```
unzip command goes here
```

3. Adjust the CFMLServlet in your web.xml to include the custom API paths. Add this line: `<url-pattern>/nuxtutils/index.cfm/*</url-pattern>`:

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

4. In the `mura` service within your docker-compose.yml, load in the new nuxtutils directory and web.xml file:
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

6. Install Mura by loading http://localhost:8888/admin . Then login using the default admin credentials: (`admin`/`admin`)

7. Create a new REST service called `s2usertoken`

8. In your `nuxtjs` directory, create the `pages/impersonate.vue` page:
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