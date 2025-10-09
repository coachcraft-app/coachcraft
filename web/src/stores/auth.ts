import { User, UserManager } from "oidc-client-ts";

export default class auth {
  public user: User | undefined = undefined;
  public userManager: UserManager | undefined = undefined;

  /**
   * empty constructor for instantiation
   */
  public constructor() {}
}
