type UserFilter= {
  //TODO: add the filter properties that we will set based on the user form
};

export function filterToQueryParams(filter : UserFilter): Object {

  //TODO: once properties are established, create an object that can be destructured into query params.
  //It should have a series of key-value pairs with depth 1
  return {
    "oneprop":"oneval",
    "secondprop":"secondval"
  };
}

export default UserFilter;