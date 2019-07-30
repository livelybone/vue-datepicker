import { shallowMount } from '@vue/test-utils'
import VueDatepicker from '../src/components/Index.vue'

describe('Index.vue', () => {
  it('Rendered', () => {
    const wrapper = shallowMount(VueDatepicker)
    expect(wrapper.find('div').exists()).to.equal(true)
  })
})
