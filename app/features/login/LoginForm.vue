<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('请输入有效邮箱'),
  password: z.string().min(8, '密码至少 8 位'),
})

type LoginValues = z.infer<typeof loginSchema>

useForm<LoginValues>({
  initialValues: {
    email: '',
    password: '',
  },
})

const { errorMessage: emailError, value: email } = useField<string>('email')
const { errorMessage: passwordError, value: password } = useField<string>('password')
const formErrors = reactive<Partial<Record<keyof LoginValues, string>>>({})
const hasSubmitted = ref(false)

function onSubmit() {
  hasSubmitted.value = true
  formErrors.email = undefined
  formErrors.password = undefined

  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  })

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    formErrors.email = fieldErrors.email?.[0]
    formErrors.password = fieldErrors.password?.[0]
    return
  }

  toast.success('模拟登录成功', {
    description: `${result.data.email} 已通过前端表单校验。`,
  })
}
</script>

<template>
  <form
    class="grid gap-5"
    :data-submitted="hasSubmitted ? 'true' : 'false'"
    novalidate
    onsubmit="this.dataset.submitted = 'true'; return false"
    @submit.prevent="onSubmit"
  >
    <FormItem>
      <Label for="email">
        邮箱
      </Label>
      <Input
        id="email"
        v-model="email"
        autocomplete="email"
        :aria-invalid="!!formErrors.email || !!emailError"
        placeholder="you@example.com"
        type="email"
      />
      <FormMessage class="form-error" :message="formErrors.email ?? emailError ?? '请输入有效邮箱'" />
    </FormItem>

    <FormItem>
      <Label for="password">
        密码
      </Label>
      <Input
        id="password"
        v-model="password"
        autocomplete="current-password"
        :aria-invalid="!!formErrors.password || !!passwordError"
        placeholder="至少 8 位"
        type="password"
      />
      <FormDescription>这是 mock 表单，不会接入真实认证。</FormDescription>
      <FormMessage class="form-error" :message="formErrors.password ?? passwordError ?? '密码至少 8 位'" />
    </FormItem>

    <button class="type-control motion-control inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90" type="submit">
      模拟登录
      <ArrowRight />
    </button>
  </form>
</template>
