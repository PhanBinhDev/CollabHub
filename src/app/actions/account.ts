'use server';

import { auth, clerkClient, reverificationError } from '@clerk/nextjs/server';

export async function deleteAccount() {
  const { has, userId } = await auth.protect();

  // Check if user has verified credentials within past 10 minutes
  const shouldUserRevalidate = !has({ reverification: 'strict' });

  if (shouldUserRevalidate) {
    return reverificationError('strict');
  }

  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(userId);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete account:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}

export async function removeEmail(emailId: string) {
  const { has } = await auth.protect();

  const shouldUserRevalidate = !has({ reverification: 'strict' });

  if (shouldUserRevalidate) {
    return reverificationError('strict');
  }

  try {
    const clerk = await clerkClient();
    await clerk.emailAddresses.deleteEmailAddress(emailId);

    return { success: true };
  } catch (error) {
    console.error('Failed to remove email:', error);
    return { success: false, error: 'Failed to remove email' };
  }
}
