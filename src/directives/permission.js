import { useUserStore } from '@/store/user';

export default {
  mounted(el, binding) {
    let user_store = useUserStore();
    let user_role = user_store.data.role;
    const required_roles = binding.value;

    if (!required_roles.includes(user_role)) {
      el.parentNode?.removeChild(el);
    }
  },
};
