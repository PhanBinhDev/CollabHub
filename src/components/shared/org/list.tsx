'use client';

import { useOrganizationList } from '@clerk/nextjs';
import { OrgItem } from './org-item';

const ListOrgs = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map(membership => (
        <OrgItem
          {...membership.organization}
          key={membership.organization.id}
        />
      ))}
    </ul>
  );
};

export default ListOrgs;
