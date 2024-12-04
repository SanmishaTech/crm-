<?php

namespace App\Http\Controllers\Api;

use Validator;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Controllers\Api\BaseController;

class ProjectsController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
       
        $authUser = auth()->user()->roles->pluck('name')->first();
        if($authUser == 'admin'){
            $projects = Project::all();

        } elseif($authUser == 'member'){
            // $projects = auth()->user()->projects()->users()->get();  //auth()->user()->projects()->users()->get();   or auth()->user()->projects()->with("users")->get();
            $user = auth()->user()->projects()->get();  //this is efficient way
        }
      
        return $this->sendResponse(['Projects'=> ProjectResource::collection($projects)], "Projects retrived successfuly");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $project = new Project();
        $project->name = $request->input('name');
        $project->description = $request->input('description');
        $project->save();

        if($request->has('users')){
            $user_id = $request->input('users');
            $project->users()->attach($user_id);
        }
 
        return $this->sendResponse(["Projects"=> new ProjectResource($project)], "Project Created Successfuly");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $project = Project::find($id);

        if(!$project){
            return $this->sendError("Project not found", ['error'=>'Project not found']);
        }
        //  $project->load('users');
        return $this->sendResponse(["Projects"=> new ProjectResource($project)], "project retrived successfully");

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {

        // if($validator->fails()){
        //   return $this->sendError("Validation Errors.", $validator->errors());
        // }

        $project = Project::find($id);
        $project->name = $request->input('name');
        $project->description = $request->input('description');
        $project->save();

        if($request->has('users')){
            $user_id = $request->input('users');
            $project->users()->sync($user_id);
        }
        else{
            $project->users()->detach();
        }

        return $this->sendResponse(['Projects'=> new ProjectResource($project)], "project retrived successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $project = Project::find($id);
        if(!$project){
            return $this->sendError("Project not found", ['error'=>'Project not found']);
        }

        $project->delete();

        return $this->sendResponse([], "project deleted successfully");
    }

    public function search(Request $request): JsonResponse
    {
        // Retrieve query parameters
        $name = $request->query('name');
        $description = $request->query('description');
      

        $authUser = auth()->user()->roles->pluck("name")->first();
        if($authUser == "admin"){
            // Initialize query
            $query = Project::query();
        }
        elseif($authUser == "member"){
            $query = auth()->user()->projects();
        }
       

        // Apply filters based on query parameters priority, weight status, start date and enddate
        if ($name) {
            $query->where('name', 'like', "%$name%");
        }

        if ($description) {
            $query->where('description', 'like', "%$description%");
        }


        // Execute query and get results
        $SearchedProjects = $query->get();
       
        // Return results, possibly as JSON for an API response
       return $this->sendResponse(['SearchedProjects'=> ProjectResource::collection($SearchedProjects)], 'Projects searched successfully');
    }

}