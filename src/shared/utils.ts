export function mergeWithExistingUser(existingUser: Record<string, any>, updatedData: Record<string, any>): Record<string, any> {
  const updatedUser = { ...existingUser };

  for (const key in updatedData) {
    if (updatedData[key] !== undefined) {
      updatedUser[key] = updatedData[key];
    }
  }

  return updatedUser;
}

export const cleanAddress = (address: any) => {
  const { address1, address2, city, state, zipcode } = address;
  return [address1 ?? null, address2 ?? null, city ?? null, state ?? null, zipcode ?? null];
};