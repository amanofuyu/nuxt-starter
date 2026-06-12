<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

const { t } = useI18n()
const formText = computed(() => ({
  email: t('login.email'),
  emailError: t('login.emailError'),
  formDescription: t('login.formDescription'),
  password: t('login.password'),
  passwordError: t('login.passwordError'),
  passwordPlaceholder: t('login.passwordPlaceholder'),
  submit: t('login.submit'),
  successTitle: t('login.successTitle'),
}))
const loginSchema = computed(() => z.object({
  email: z.email(formText.value.emailError),
  password: z.string().min(8, formText.value.passwordError),
}))

interface LoginValues {
  email: string
  password: string
}

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

  const result = loginSchema.value.safeParse({
    email: email.value,
    password: password.value,
  })

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    formErrors.email = fieldErrors.email?.[0]
    formErrors.password = fieldErrors.password?.[0]
    return
  }

  toast.success(formText.value.successTitle, {
    description: t('login.successDescription', { email: result.data.email }),
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
        {{ formText.email }}
      </Label>
      <Input
        id="email"
        v-model="email"
        autocomplete="email"
        :aria-invalid="!!formErrors.email || !!emailError"
        placeholder="you@example.com"
        type="email"
      />
      <FormMessage class="form-error" :message="formErrors.email ?? emailError ?? formText.emailError" />
    </FormItem>

    <FormItem>
      <Label for="password">
        {{ formText.password }}
      </Label>
      <Input
        id="password"
        v-model="password"
        autocomplete="current-password"
        :aria-invalid="!!formErrors.password || !!passwordError"
        :placeholder="formText.passwordPlaceholder"
        type="password"
      />
      <FormDescription>{{ formText.formDescription }}</FormDescription>
      <FormMessage class="form-error" :message="formErrors.password ?? passwordError ?? formText.passwordError" />
    </FormItem>

    <button class="type-control motion-control inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90" type="submit">
      {{ formText.submit }}
      <ArrowRight />
    </button>
  </form>
</template>
