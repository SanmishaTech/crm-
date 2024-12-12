<?php

namespace App\Http\Controllers\Api;

use Validator;
use App\Models\User;
use App\Models\Profile;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\ProfileResource;
use App\Http\Controllers\Api\BaseController;

class UserController extends BaseController
{


     /**
     * Login User
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'=>['required','email'],
            'password'=>['required','string','min:6'],
        ]);

        if($validator->fails()){
           return $this->sendError('Validation Error.', $validator->errors());
        }

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $user = Auth::user();
            $token =  $user->createToken($user->name)->plainTextToken;
            $profile = Employee::where('user_id', $user->id)->first();
            return $this->sendResponse(['user'=>new UserResource($user), 'profile'=>new ProfileResource($profile), 'token'=>$token], 'User login successfully.');

        } else{
            return $this->sendError('Invalid Credentials.', ['error'=>'Invalid Credentials']);
        }
    }

     /**
     * Logout User
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return $this->sendResponse([], 'User logged out successfully.');
    }


    /**
     * All User
     */
    public function index(): JsonResponse
    {
        $users = User::all();
        
        return $this->sendResponse(['Users'=> UserResource::collection($users)], "all users retrived sucessfully");
    }

    /**
     * Store User
     */
    public function store(Request $request){
        
       $user = new User();
       $user->name = $request->input('name');
       $user->email = $request->input('email');
       $user->password = Hash::make($request->input('password'));
       $user->save();
       
        $memberRole = Role::where("name", 'member')->first();
      
       $user->assignRole($memberRole);
       
       $profile = new Profile();
       $profile->user_id = $user->id;
       $profile->name = $user->name;
       $profile->email = $user->email;
       $profile->save();
      
       return $this->sendResponse(['User'=> new UserResource($user), 'profile'=>new ProfileResource($profile)], "user stored successfully");

    }

    /**
     * Update User
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::find($id);
        if(!$user){
            return $this->sendError("User not found", ['error'=>'User not found']);
        }
       $user->name = $request->input('name');
       $user->email = $request->input('email');
       $user->password = Hash::make($request->input('password'));
       $user->save();
    
        $memberRole = Role::where("name", 'member')->first();
    
       $user->assignRole($memberRole);
       
       $profile = Profile::where('user_id',$user->id)->first();
       $profile->name = $user->name;
       $profile->email = $user->email;
       $profile->save();
      
       return $this->sendResponse(['User'=> new UserResource($user), 'profile'=>new ProfileResource($profile)], "User Updated successfully");

    }

    /**
     * delete User
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::find($id);

        if(!$user){
            return $this->sendError("User not found", ['error'=>'User not found']);
        }
        $profile = Profile::where('user_id', $user->id)->first();
        $profile->delete();
        $user->delete();

        return $this->sendResponse([], "User and his Profile deleted successfully");

    }

    
    /**
     * show User
     */
    public function show(string $id): JsonResponse
    {
        $user = User::find($id);

        if(!$user){
            return $this->sendError("User not found", ['error'=>'User not found']);
        }
        // $profile = Profile::where('user_id', $user->id)->first();
        // $profile->delete();
        // $user->delete();

        return $this->sendResponse(['User'=> new UserResource($user)], "User Retrieved successfully");

    }
}