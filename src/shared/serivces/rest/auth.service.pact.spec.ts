import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Store } from "@ngxs/store";
import { Matchers } from "@pact-foundation/pact-web";
import { MockProvider } from "ng-mocks";
import { RestService } from "../infrastructure/rest.service";
import {
  AuthService,
  ILoginResponseDTO,
  ISignUpResponseDTO,
  IVerifyEmailResponseDTO,
} from "./auth.service";

import { IUser } from "../../models/user.interface";

describe("Pact with Auth API", () => {
  const { like } = Matchers;

  let authService: AuthService;

  afterAll(async () => {
    await provider.finalize();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MockProvider(Store)],
    });

    authService = TestBed.inject(AuthService);
  });

  const email = "test@mail.com";
  const password = "password";
  const firstName = "First Name";
  const lastName = "Last Name";
  const userId = "6152e88f3560e501082c1727";

  describe("when a login call to the API is made", () => {
    const loginResponse: ILoginResponseDTO = {
      userDto: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userId: userId,
      },
    };

    beforeAll(async () => {
      await provider.addInteraction({
        state: `there is a not logged in user with username=${email} and password=${password}`,
        uponReceiving: `a request for login a user`,
        withRequest: {
          method: "POST",
          path: "/api/auth/login",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: {
            username: email,
            password: password,
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: like(loginResponse),
        },
      });
    });

    it("should login user with email and password", async () => {
      let signUpError = null;
      let user: IUser;

      try {
        user = await authService.login(email, password);
      } catch (error) {
        signUpError = error;
      }

      expect(signUpError).toBeNull();
      expect(user).toBeTruthy();
      expect(user).toEqual(loginResponse.userDto);
    });
  });

  describe("when a logout call to the API is made", () => {
    beforeAll(async () => {
      await provider.addInteraction({
        state: `there is a logged in user`,
        uponReceiving: `a request for logout a user`,
        withRequest: {
          method: "DELETE",
          path: "/api/auth/logout",
        },
        willRespondWith: {
          status: 200,
        },
      });
    });

    it("should logout user", async () => {
      let logoutError = null;

      try {
        await authService.logout();
      } catch (error) {
        logoutError = error;
      }

      expect(logoutError).toBeNull();
    });
  });

  describe("when a signUp call to the API is made", () => {
    const signUpResponse: ISignUpResponseDTO = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    beforeAll(async () => {
      await provider.addInteraction({
        state: `has not user with ${email}`,
        uponReceiving: `a request for signup a user with ${email}`,
        withRequest: {
          method: "POST",
          path: "/api/auth/signup",
          headers: {
            "Content-Type": like("application/json; charset=utf-8"),
          },
          body: {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": like("application/json; charset=utf-8"),
          },
          body: like(signUpResponse),
        },
      });
    });

    it("should signup user", async () => {
      let signUpError = null;
      let response: ISignUpResponseDTO;

      try {
        response = await authService.signUp({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        });
      } catch (error) {
        signUpError = error;
      }

      expect(signUpError).toBeNull();
      expect(response).toBeTruthy();
      expect(response).toEqual(signUpResponse);
    });
  });

  describe("when a verifyUserEmailWithToken call to the API is made", () => {
    const token = "token_123!&#";
    const verifyEmailResponse: IVerifyEmailResponseDTO = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      verified: true,
    };

    beforeAll(async () => {
      await provider.addInteraction({
        state: `has not verified user with username=${email}`,
        uponReceiving: `a request for verify the user with ${email}`,
        withRequest: {
          method: "GET",
          path: "/api/auth/verify-email",
          query: RestService.convertObjectToUrlParams({ token: token }),
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": like("application/json; charset=utf-8"),
          },
          body: like(verifyEmailResponse),
        },
      });
    });

    it("should verify email by token", async () => {
      let verifyError = null;
      let response: IVerifyEmailResponseDTO;

      authService = TestBed.inject(AuthService);

      try {
        response = await authService.verifyUserEmailWithToken(token);
      } catch (error) {
        verifyError = error;
      }

      expect(verifyError).toBeNull();
      expect(response).toBeTruthy();
      expect(response).toEqual({
        firstName: firstName,
        lastName: lastName,
        email: email,
        verified: true,
      });
    });
  });
});
