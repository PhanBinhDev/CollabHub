'use server';

import { INTERVAL } from '@/constants/app';
import { api } from '@/convex/_generated/api';
import { auth, clerkClient, reverificationError } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';

export async function deleteAccount() {
  const { has, userId } = await auth.protect();

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

export async function setPrimaryEmail(emailId: string) {
  const { has } = await auth.protect();
  const shouldUserRevalidate = !has({ reverification: 'strict' });
  if (shouldUserRevalidate) {
    return reverificationError('strict');
  }

  try {
    const clerk = await clerkClient();
    const updated = await clerk.emailAddresses.updateEmailAddress(emailId, {
      primary: true,
    });

    return { success: true, email: updated };
  } catch (error) {
    console.error('Failed to set primary email:', error);
    return { success: false, error: 'Failed to set primary email' };
  }
}

export async function verifyEmailAddress(emailId: string) {
  const { has } = await auth.protect();

  const shouldUserRevalidate = !has({ reverification: 'strict' });

  if (shouldUserRevalidate) {
    return reverificationError('strict');
  }

  try {
    const rate = await fetchMutation(api.emails.tryCreateVerification, {
      emailId,
      minIntervalSeconds: INTERVAL,
    });

    if (!rate?.allowed) {
      return {
        success: false,
        error: 'THROTTLED',
        retryAfter: rate?.retryAfter || 60,
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to verify email address' };
  }
}
