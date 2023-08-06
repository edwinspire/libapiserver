
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const PORT: string;
	export const BUILD_DB_ON_START: string;
	export const DATABASE_URL_APIREST: string;
	export const JWT_KEY: string;
	export const EXPOSE_DEV_API: string;
	export const EXPOSE_QA_API: string;
	export const EXPOSE_PROD_API: string;
	export const MQTT_ENABLED: string;
	export const npm_config_cache_lock_stale: string;
	export const npm_config_ham_it_up: string;
	export const QT_SCALE_FACTOR: string;
	export const npm_package_dependencies_bulma: string;
	export const npm_config_legacy_bundling: string;
	export const npm_config_sign_git_tag: string;
	export const LANGUAGE: string;
	export const USER: string;
	export const npm_config_user_agent: string;
	export const npm_config_always_auth: string;
	export const npm_package_scripts_dev_vite: string;
	export const npm_package_dependencies_tedious: string;
	export const npm_config_bin_links: string;
	export const npm_config_key: string;
	export const SSH_AGENT_PID: string;
	export const XDG_SESSION_TYPE: string;
	export const GIT_ASKPASS: string;
	export const npm_package_devDependencies_vite: string;
	export const npm_package_dependencies_codemirror: string;
	export const npm_config_allow_same_version: string;
	export const npm_config_description: string;
	export const npm_config_fetch_retries: string;
	export const npm_config_heading: string;
	export const npm_config_if_present: string;
	export const npm_config_init_version: string;
	export const npm_config_user: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const npm_config_prefer_online: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const CHROME_DESKTOP: string;
	export const npm_package_devDependencies__vitejs_plugin_basic_ssl: string;
	export const npm_package_dependencies__edwinspire_universal_fetch: string;
	export const npm_config_force: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const npm_config_only: string;
	export const npm_config_read_only: string;
	export const npm_config_cache_min: string;
	export const npm_config_init_license: string;
	export const NODE_OPTIONS: string;
	export const GTK_MODULES: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const npm_package_dependencies__codemirror_lint: string;
	export const npm_config_editor: string;
	export const npm_config_rollback: string;
	export const npm_config_tag_version_prefix: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const npm_package_scripts_check: string;
	export const npm_config_cache_max: string;
	export const npm_config_timing: string;
	export const npm_config_userconfig: string;
	export const XRDP_PULSE_SOURCE_SOCKET: string;
	export const XRDP_PULSE_SINK_SOCKET: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_package_dependencies_dotenv: string;
	export const npm_config_engine_strict: string;
	export const npm_config_init_author_name: string;
	export const npm_config_init_author_url: string;
	export const npm_config_preid: string;
	export const npm_config_tmp: string;
	export const COLORTERM: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const npm_package_description: string;
	export const npm_package_devDependencies_typescript: string;
	export const npm_config_depth: string;
	export const npm_config_package_lock_only: string;
	export const npm_config_save_dev: string;
	export const npm_config_usage: string;
	export const npm_package_dependencies_d3: string;
	export const npm_package_readmeFilename: string;
	export const npm_config_metrics_registry: string;
	export const npm_config_cafile: string;
	export const npm_config_otp: string;
	export const npm_config_package_lock: string;
	export const npm_config_progress: string;
	export const npm_config_https_proxy: string;
	export const npm_config_save_prod: string;
	export const PULSE_SCRIPT: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_config_audit: string;
	export const npm_config_cidr: string;
	export const npm_config_onload_script: string;
	export const npm_config_sso_type: string;
	export const GTK_IM_MODULE: string;
	export const LOGNAME: string;
	export const npm_package_type: string;
	export const npm_config_rebuild_bundle: string;
	export const npm_config_save_bundle: string;
	export const npm_config_shell: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const _: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_devDependencies__sveltejs_adapter_node: string;
	export const npm_package_dependencies_express: string;
	export const npm_package_dependencies_websocket_stream: string;
	export const npm_config_prefix: string;
	export const npm_config_dry_run: string;
	export const npm_config_format_package_lock: string;
	export const XDG_SESSION_CLASS: string;
	export const npm_package_scripts_lint: string;
	export const npm_config_scope: string;
	export const npm_config_browser: string;
	export const npm_config_cache_lock_wait: string;
	export const npm_config_ignore_prepublish: string;
	export const npm_config_registry: string;
	export const npm_config_save_optional: string;
	export const npm_config_searchopts: string;
	export const npm_config_versions: string;
	export const TERM: string;
	export const GTK_OVERLAY_SCROLLING: string;
	export const XDG_SESSION_ID: string;
	export const npm_package_dependencies__codemirror_lang_json: string;
	export const npm_package_dependencies__edwinspire_svelte_components: string;
	export const npm_config_cache: string;
	export const npm_config_proxy: string;
	export const npm_config_send_metrics: string;
	export const npm_config_global_style: string;
	export const npm_config_ignore_scripts: string;
	export const npm_config_version: string;
	export const npm_config_local_address: string;
	export const npm_config_viewer: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SESSION_MANAGER: string;
	export const npm_package_name: string;
	export const npm_package_scripts_package: string;
	export const npm_config_audit_level: string;
	export const npm_config_prefer_offline: string;
	export const NODE: string;
	export const XRDP_SOCKET_PATH: string;
	export const XDG_RUNTIME_DIR: string;
	export const GDK_BACKEND: string;
	export const npm_package_dependencies__observablehq_plot: string;
	export const npm_config_color: string;
	export const npm_config_sign_git_commit: string;
	export const DISPLAY: string;
	export const npm_config_fetch_retry_mintimeout: string;
	export const npm_config_maxsockets: string;
	export const npm_config_offline: string;
	export const npm_config_sso_poll_frequency: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_dependencies_soap: string;
	export const npm_config_umask: string;
	export const XMODIFIERS: string;
	export const LS_COLORS: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const TERM_PROGRAM: string;
	export const npm_package_main: string;
	export const npm_package_scripts_build_test: string;
	export const npm_package_dependencies_aedes: string;
	export const npm_package_dependencies_sqlite3: string;
	export const npm_package_gitHead: string;
	export const npm_config_fund: string;
	export const npm_config_fetch_retry_maxtimeout: string;
	export const npm_config_loglevel: string;
	export const npm_config_logs_max: string;
	export const npm_config_message: string;
	export const npm_lifecycle_script: string;
	export const SSH_AUTH_SOCK: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const UID: string;
	export const npm_package_scripts_test: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_package_dependencies_sequelize: string;
	export const npm_config_ca: string;
	export const npm_config_cert: string;
	export const npm_config_global: string;
	export const npm_config_link: string;
	export const SHELL: string;
	export const npm_package_version: string;
	export const npm_config_access: string;
	export const npm_config_also: string;
	export const npm_config_save: string;
	export const npm_config_unicode: string;
	export const npm_lifecycle_event: string;
	export const QT_ACCESSIBILITY: string;
	export const npm_package_scripts_build: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_dependencies_cookie: string;
	export const npm_package_dependencies_uuid: string;
	export const npm_config_argv: string;
	export const npm_config_before: string;
	export const npm_config_long: string;
	export const npm_config_production: string;
	export const npm_config_searchlimit: string;
	export const npm_config_unsafe_perm: string;
	export const npm_config_update_notifier: string;
	export const XRDP_SESSION: string;
	export const npm_package_dependencies__codemirror_lang_sql: string;
	export const npm_config_auth_type: string;
	export const npm_config_node_version: string;
	export const npm_config_tag: string;
	export const npm_config_git_tag_version: string;
	export const npm_config_commit_hooks: string;
	export const npm_config_script_shell: string;
	export const npm_config_shrinkwrap: string;
	export const GPG_AGENT_INFO: string;
	export const npm_package_dependencies__codemirror_lang_javascript: string;
	export const npm_config_fetch_retry_factor: string;
	export const npm_config_save_exact: string;
	export const npm_config_strict_ssl: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const QT_IM_MODULE: string;
	export const npm_package_scripts_format: string;
	export const npm_config_globalconfig: string;
	export const npm_config_dev: string;
	export const npm_config_init_module: string;
	export const npm_config_parseable: string;
	export const PWD: string;
	export const npm_config_globalignorefile: string;
	export const npm_execpath: string;
	export const CLUTTER_IM_MODULE: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_cache_lock_retries: string;
	export const npm_config_searchstaleness: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_config_node_options: string;
	export const npm_config_save_prefix: string;
	export const npm_config_scripts_prepend_node_path: string;
	export const MATE_DESKTOP_SESSION_ID: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_dependencies_jsonwebtoken: string;
	export const npm_config_group: string;
	export const npm_config_init_author_email: string;
	export const npm_config_searchexclude: string;
	export const npm_config_git: string;
	export const npm_config_optional: string;
	export const npm_package_dependencies_pg: string;
	export const npm_config_json: string;
	export const INIT_CWD: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		PORT: string;
		BUILD_DB_ON_START: string;
		DATABASE_URL_APIREST: string;
		JWT_KEY: string;
		EXPOSE_DEV_API: string;
		EXPOSE_QA_API: string;
		EXPOSE_PROD_API: string;
		MQTT_ENABLED: string;
		npm_config_cache_lock_stale: string;
		npm_config_ham_it_up: string;
		QT_SCALE_FACTOR: string;
		npm_package_dependencies_bulma: string;
		npm_config_legacy_bundling: string;
		npm_config_sign_git_tag: string;
		LANGUAGE: string;
		USER: string;
		npm_config_user_agent: string;
		npm_config_always_auth: string;
		npm_package_scripts_dev_vite: string;
		npm_package_dependencies_tedious: string;
		npm_config_bin_links: string;
		npm_config_key: string;
		SSH_AGENT_PID: string;
		XDG_SESSION_TYPE: string;
		GIT_ASKPASS: string;
		npm_package_devDependencies_vite: string;
		npm_package_dependencies_codemirror: string;
		npm_config_allow_same_version: string;
		npm_config_description: string;
		npm_config_fetch_retries: string;
		npm_config_heading: string;
		npm_config_if_present: string;
		npm_config_init_version: string;
		npm_config_user: string;
		npm_node_execpath: string;
		SHLVL: string;
		npm_config_prefer_online: string;
		npm_config_noproxy: string;
		HOME: string;
		CHROME_DESKTOP: string;
		npm_package_devDependencies__vitejs_plugin_basic_ssl: string;
		npm_package_dependencies__edwinspire_universal_fetch: string;
		npm_config_force: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		npm_config_only: string;
		npm_config_read_only: string;
		npm_config_cache_min: string;
		npm_config_init_license: string;
		NODE_OPTIONS: string;
		GTK_MODULES: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		npm_package_devDependencies_svelte_check: string;
		npm_package_dependencies__codemirror_lint: string;
		npm_config_editor: string;
		npm_config_rollback: string;
		npm_config_tag_version_prefix: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		npm_package_scripts_check: string;
		npm_config_cache_max: string;
		npm_config_timing: string;
		npm_config_userconfig: string;
		XRDP_PULSE_SOURCE_SOCKET: string;
		XRDP_PULSE_SINK_SOCKET: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_package_dependencies_dotenv: string;
		npm_config_engine_strict: string;
		npm_config_init_author_name: string;
		npm_config_init_author_url: string;
		npm_config_preid: string;
		npm_config_tmp: string;
		COLORTERM: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		npm_package_description: string;
		npm_package_devDependencies_typescript: string;
		npm_config_depth: string;
		npm_config_package_lock_only: string;
		npm_config_save_dev: string;
		npm_config_usage: string;
		npm_package_dependencies_d3: string;
		npm_package_readmeFilename: string;
		npm_config_metrics_registry: string;
		npm_config_cafile: string;
		npm_config_otp: string;
		npm_config_package_lock: string;
		npm_config_progress: string;
		npm_config_https_proxy: string;
		npm_config_save_prod: string;
		PULSE_SCRIPT: string;
		npm_package_scripts_dev: string;
		npm_package_devDependencies_prettier: string;
		npm_config_audit: string;
		npm_config_cidr: string;
		npm_config_onload_script: string;
		npm_config_sso_type: string;
		GTK_IM_MODULE: string;
		LOGNAME: string;
		npm_package_type: string;
		npm_config_rebuild_bundle: string;
		npm_config_save_bundle: string;
		npm_config_shell: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		_: string;
		npm_package_scripts_check_watch: string;
		npm_package_devDependencies__sveltejs_adapter_node: string;
		npm_package_dependencies_express: string;
		npm_package_dependencies_websocket_stream: string;
		npm_config_prefix: string;
		npm_config_dry_run: string;
		npm_config_format_package_lock: string;
		XDG_SESSION_CLASS: string;
		npm_package_scripts_lint: string;
		npm_config_scope: string;
		npm_config_browser: string;
		npm_config_cache_lock_wait: string;
		npm_config_ignore_prepublish: string;
		npm_config_registry: string;
		npm_config_save_optional: string;
		npm_config_searchopts: string;
		npm_config_versions: string;
		TERM: string;
		GTK_OVERLAY_SCROLLING: string;
		XDG_SESSION_ID: string;
		npm_package_dependencies__codemirror_lang_json: string;
		npm_package_dependencies__edwinspire_svelte_components: string;
		npm_config_cache: string;
		npm_config_proxy: string;
		npm_config_send_metrics: string;
		npm_config_global_style: string;
		npm_config_ignore_scripts: string;
		npm_config_version: string;
		npm_config_local_address: string;
		npm_config_viewer: string;
		npm_config_node_gyp: string;
		PATH: string;
		SESSION_MANAGER: string;
		npm_package_name: string;
		npm_package_scripts_package: string;
		npm_config_audit_level: string;
		npm_config_prefer_offline: string;
		NODE: string;
		XRDP_SOCKET_PATH: string;
		XDG_RUNTIME_DIR: string;
		GDK_BACKEND: string;
		npm_package_dependencies__observablehq_plot: string;
		npm_config_color: string;
		npm_config_sign_git_commit: string;
		DISPLAY: string;
		npm_config_fetch_retry_mintimeout: string;
		npm_config_maxsockets: string;
		npm_config_offline: string;
		npm_config_sso_poll_frequency: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_devDependencies_eslint: string;
		npm_package_dependencies_soap: string;
		npm_config_umask: string;
		XMODIFIERS: string;
		LS_COLORS: string;
		VSCODE_GIT_IPC_HANDLE: string;
		TERM_PROGRAM: string;
		npm_package_main: string;
		npm_package_scripts_build_test: string;
		npm_package_dependencies_aedes: string;
		npm_package_dependencies_sqlite3: string;
		npm_package_gitHead: string;
		npm_config_fund: string;
		npm_config_fetch_retry_maxtimeout: string;
		npm_config_loglevel: string;
		npm_config_logs_max: string;
		npm_config_message: string;
		npm_lifecycle_script: string;
		SSH_AUTH_SOCK: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		UID: string;
		npm_package_scripts_test: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_package_dependencies_sequelize: string;
		npm_config_ca: string;
		npm_config_cert: string;
		npm_config_global: string;
		npm_config_link: string;
		SHELL: string;
		npm_package_version: string;
		npm_config_access: string;
		npm_config_also: string;
		npm_config_save: string;
		npm_config_unicode: string;
		npm_lifecycle_event: string;
		QT_ACCESSIBILITY: string;
		npm_package_scripts_build: string;
		npm_package_devDependencies_svelte: string;
		npm_package_dependencies_cookie: string;
		npm_package_dependencies_uuid: string;
		npm_config_argv: string;
		npm_config_before: string;
		npm_config_long: string;
		npm_config_production: string;
		npm_config_searchlimit: string;
		npm_config_unsafe_perm: string;
		npm_config_update_notifier: string;
		XRDP_SESSION: string;
		npm_package_dependencies__codemirror_lang_sql: string;
		npm_config_auth_type: string;
		npm_config_node_version: string;
		npm_config_tag: string;
		npm_config_git_tag_version: string;
		npm_config_commit_hooks: string;
		npm_config_script_shell: string;
		npm_config_shrinkwrap: string;
		GPG_AGENT_INFO: string;
		npm_package_dependencies__codemirror_lang_javascript: string;
		npm_config_fetch_retry_factor: string;
		npm_config_save_exact: string;
		npm_config_strict_ssl: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		QT_IM_MODULE: string;
		npm_package_scripts_format: string;
		npm_config_globalconfig: string;
		npm_config_dev: string;
		npm_config_init_module: string;
		npm_config_parseable: string;
		PWD: string;
		npm_config_globalignorefile: string;
		npm_execpath: string;
		CLUTTER_IM_MODULE: string;
		XDG_DATA_DIRS: string;
		npm_config_cache_lock_retries: string;
		npm_config_searchstaleness: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_config_node_options: string;
		npm_config_save_prefix: string;
		npm_config_scripts_prepend_node_path: string;
		MATE_DESKTOP_SESSION_ID: string;
		npm_package_scripts_preview: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_dependencies_jsonwebtoken: string;
		npm_config_group: string;
		npm_config_init_author_email: string;
		npm_config_searchexclude: string;
		npm_config_git: string;
		npm_config_optional: string;
		npm_package_dependencies_pg: string;
		npm_config_json: string;
		INIT_CWD: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
