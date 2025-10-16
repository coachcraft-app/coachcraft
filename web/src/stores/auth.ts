/**
 * Auth store to hold user information
 * Used by the alpine singleton class
 *
 * @module
 */

/**
 * Auth store type definition
 */
export class auth {
  public userProfilePic: string | undefined;
  public givenName: string | undefined;
  public userEmail: string | undefined;

  /**
   * empty constructor for instantiation
   */
  public constructor() {}
}

export default auth;
