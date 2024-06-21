import { test, expect } from '@playwright/test'
import { loginNewUser } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

const { email, password } = fakeUser()
test.use({ colorScheme: 'dark' })

test.describe.serial('signup and login sequence', () => {
  test.fixme('visitor can signup', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/signup')
    const successMessage = page.getByTestId('successMessage')
    await expect(successMessage).toBeHidden()

    // When (ACT)
    const form = page.getByRole('form')
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(successMessage).toBeVisible()
  })

  test.fixme('visitor can not access home page before login', async ({ page }) => {
    await page.goto('/home')
    await page.waitForURL('/login')
  })

  test.fixme('visitor can login', async ({ page }) => {
    // Given (ARRANGE)
    await page.goto('/login')
    const heading = page.getByTestId('home-heading')
    await expect(heading).toBeHidden()

    // When (ACT)
    const form = page.getByRole('form')
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    // Then (ASSERT)
    await expect(heading).toBeVisible()
    await page.reload()
    await expect(heading).toBeVisible()
  })
})

// Running logout test in isolation.
test('visitor can logout', async ({ page }) => {
  // Given (ARRANGE)
  await loginNewUser(page)

  await page.goto('/home')
  const logoutLink = page.getByText('Logout')

  // When (ACT)
  await logoutLink.click()

  // Then (ASSERT)
  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/')

  // Refresh the page to make sure that the user is still logged out.
  await page.goto('/home')
  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/login')
})
