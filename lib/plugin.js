import axios from "axios";
import Mura from "mura.js";
import cookieUniversal from "cookie-universal";

export default async (context, inject) => {
	const { route, app, isDev, req, res } = context;
	if (route.name !== "impersonate") {
		// If we're not trying to impersonate a user, don't load the rest of the plugin.
		return;
	}
	// require("~/mura.config.js");

	// Inject cookieUniversal as $cookiez here, because for some reason it wasn't available here
	// by just loading the cookie-universal-nuxt module in nuxt.config.js
	// Use the alias "cookiez" to prevent an issue with $cookies (default alias)
	inject("cookiez", cookieUniversal(req, res));

	const handleError = (err) => {
		console.log("impersonateMura: An error was caught...");
		if (isDev) {
			console.log({ err });
		}
	};

	// Create the API methods needed to impersonate
	const impersonateServiceApi = {
		getS2Token() {
			let url = `${process.env.rootpath}/nuxtutils/index.cfm/nuxtUtilsService/gets2token`;
			return axios.post(
				url,
				{ data: "" },
				{ headers: { Authorization: process.env.basicAuthS2Token } }
			);
		},
		impersonateUser(data) {
			let url = `${process.env.rootpath}/nuxtutils/index.cfm/nuxtUtilsService/impersonateUser`;
			return axios.post(url, {
				data,
			});
		},
	};

	// The method used to trigger the impersonate user action
	const impersonateUser = async function (targetUsername) {
		const s2usertoken = app.$cookiez.get(process.env.s2usertoken);

		// Retrieve the targeted user's session information:
		const targetSessionInfo = await impersonateServiceApi
			.impersonateUser({
				targetUsername,
				s2usertoken,
			})
			.catch(handleError);

		if (targetSessionInfo.data.message.length) {
			alert(targetSessionInfo.data.message);
		} else if (targetSessionInfo.data.session) {
			const cookieStrings = targetSessionInfo.data.session.split("&");
			cookieStrings.forEach((str) => {
				let [cookieName, cookieValue] = str.split("=");
				cookieName = cookieName.toLowerCase();
				// Attempt to overwrite (or create secondary) cfid and cftoken cookies on the client to impersonate the user.
				// Currently only works in Safari
				Mura.createCookie(
					cookieName,
					cookieValue,
					false,
					process.env.impersonateDomain
				);
			});
			window.location.href = "/";
		}
	};
	// Make $impersonateUser available to use in Vue components
	inject("impersonateUser", impersonateUser);

	if (process.server) {
		Mura.init({
			rootpath: process.env.rootpath,
			siteid: "default",
			processMarkup: false,
			response: context.res,
			request: context.req,
		});

		// Only get current user's S2 status if we are on the impersonate page
		if (route.name === "impersonate") {
			delete Mura.currentUser;
			const currentUserResponse = await Mura.getCurrentUser({
				fields: "s2",
			}).catch(handleError);
			const currentUser = currentUserResponse.properties;
			if (currentUser.s2 === 1) {
				console.log("This user is an s2 user. Set the s2usertoken cookie");
				const response = await impersonateServiceApi
					.getS2Token()
					.catch(handleError);
				const s2usertoken = response.data.access_token;
				app.$cookiez.set(process.env.s2usertoken, s2usertoken);
			} else {
				console.log("This user is not an s2 user");
			}
		}
	}
};
