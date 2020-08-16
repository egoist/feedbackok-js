import { defineComponent, h, onMounted, onBeforeUnmount, ref } from 'vue'
import { FormConfig, mount } from 'feedbackok'

export const FeedbackForm = defineComponent({
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const rootRef = ref<HTMLElement | null>(null)
    let destroy: undefined | ((el: HTMLElement) => void)
    onMounted(() => {
      if (rootRef.value) {
        destroy = mount(props.config as FormConfig, rootRef.value)
      }
    })
    onBeforeUnmount(() => {
      if (destroy && rootRef.value) {
        destroy(rootRef.value)
      }
    })
    return () => h('div', { ref: rootRef })
  },
})
