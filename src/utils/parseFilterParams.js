export const parseFilterParams = (query) => {
  const filter = {};
  if (query.contactTypes) filter.contactType = query.contactType;
  if (query.isFavourite !== undefined) {
    filter.isFavourite = query.isFavourite === 'true';
  }

  return filter;
};
