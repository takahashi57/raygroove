import Vue from 'vue'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import BugsnagPerformance from '@bugsnag/browser-performance'

Bugsnag.start({
  apiKey: 'c0b3f5ebd5a859008686b1d7e8d97243',
  plugins: [new BugsnagPluginVue()]
})
BugsnagPerformance.start({ apiKey: 'c0b3f5ebd5a859008686b1d7e8d97243' })