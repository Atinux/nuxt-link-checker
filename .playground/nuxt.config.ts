import { defineNuxtConfig } from 'nuxt/config'
import NuxtLinkChecker from '../src/module'
import {defineNuxtModule} from "@nuxt/kit";
import {startSubprocess} from "@nuxt/devtools-kit";
import {resolve} from "path";

export default defineNuxtConfig({
  modules: [
    NuxtLinkChecker,
    'nuxt-simple-sitemap',
    '@nuxthq/ui',
    'nuxt-icon',
    /**
     * Start a sub Nuxt Server for developing the client
     *
     * The terminal output can be found in the Terminals tab of the devtools.
     */
    defineNuxtModule({
      setup(_, nuxt) {
        if (!nuxt.options.dev) {
          return
        }

        const subprocess = startSubprocess(
          {
            command: 'npx',
            args: ['nuxi', 'dev', '--port', '3030'],
            cwd: resolve(__dirname, '../client'),
          },
          {
            id: 'nuxt-link-checker:client',
            name: 'Nuxt Link Checker Client Dev',
          }
        )
        subprocess.getProcess().stdout?.on('data', (data) => {
          console.log(' sub: ' + data.toString())
        })

        process.on('exit', () => {
          subprocess.terminate()
        })

        // process.getProcess().stdout?.pipe(process.stdout)
        // process.getProcess().stderr?.pipe(process.stderr)
      },
    }),
  ],

  site: {
    url: 'https://nuxt-link-checker.com',
  },

  nitro: {
    prerender: {
      failOnError: false,
    }
  },

  linkChecker: {
    failOnError: true,
    excludeLinks: ['/ignored'],
    skipInspections: ['missing-hash'],
    report: {
      html: true,
      markdown: true,
    }
  },

  devtools: {
    enabled: true,
  },

})
