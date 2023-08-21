import { Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../../constants/api-endpoints.const";
import { IUserDto } from "../../dto/user.dto";
import { UserMapper } from "../../mappers/user.mapper";
import { IUser } from "../../models/user.interface";
import { UserAction } from "../../state/user.actions";
import { HTTP_METHODS, RestService } from "../infrastructure/rest.service";

export interface ILoginResponseDTO {
  userDto: IUserDto;
}

export interface ISignUpRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ISignUpResponseDTO {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IVerifyEmailResponseDTO {
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private restService: RestService) {}

  public async login(email: string, passwordHash: string): Promise<IUser> {
    try {
      const res: ILoginResponseDTO = await this.restService
        .makeRequest<ILoginResponseDTO>(
          HTTP_METHODS.POST,
          API_ENDPOINTS.AUTH.LOGIN,
          {
            username: email,
            password: passwordHash,
          }
        )
        .toPromise();

      const user: IUser = UserMapper.toModel(res.userDto);
      return user;
    } catch (error) {
      console.log("Login request to server failed");
      console.log(error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.restService
        .makeRequest(HTTP_METHODS.DELETE, API_ENDPOINTS.AUTH.LOGOUT)
        .toPromise();
    } catch (error) {
      console.log("Logout request to server failed");
      console.log(error);
      throw error;
    }
  }

  public async signUp(data: ISignUpRequestDTO): Promise<ISignUpResponseDTO> {
    try {
      const response: ISignUpResponseDTO = await this.restService
        .makeRequest<ISignUpResponseDTO>(
          HTTP_METHODS.POST,
          API_ENDPOINTS.AUTH.SIGNUP,
          { ...data }
        )
        .toPromise();
      return response;
    } catch (error) {
      console.log("SignUp request to server failed");
      console.log(error);
      throw error;
    }
  }

  public async verifyUserEmailWithToken(
    token: string
  ): Promise<IVerifyEmailResponseDTO> {
    try {
      const response: IVerifyEmailResponseDTO = await this.restService
        .makeRequest<IVerifyEmailResponseDTO>(
          HTTP_METHODS.GET,
          API_ENDPOINTS.AUTH.VERIFY_EMAIL,
          { token: token }
        )
        .toPromise();
      return response;
    } catch (error) {
      console.log("Verufy User Email With Token request to server failed");
      console.log(error);
      throw error;
    }
  }
}
