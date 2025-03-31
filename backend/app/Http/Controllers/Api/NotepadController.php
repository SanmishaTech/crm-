<?php

namespace App\Http\Controllers\Api;

use App\Models\Notepad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotepadResource;
use App\Http\Controllers\Api\BaseController;

class NotepadController extends BaseController
{
    /**
     * All Notepad.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notepad::query()->where('user_id', auth()->id());

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
    
            $query->where(function ($query) use ($searchTerm) {
                $query->where('note_title', 'like', '%' . $searchTerm . '%');
            });
        }
        $notes = $query->orderBy("id", "DESC")->get();

        return $this->sendResponse([
            "Notepad" => NotepadResource::collection($notes)
        ], "Notepad retrieved successfully");
    }

   
    public function store(Request $request): JsonResponse
    {
        $notes = new Notepad();
        $notes->user_id = auth()->id();
        $notes->note_title = $request->input("note_title");
        $notes->note_content = $request->input("note_content");
        $notes->note_color = $request->input("note_color");
        
        if(!$notes->save()) {
            return $this->sendError("Failed to save note", ['error'=>'Database error']);
        }
        
        return $this->sendResponse(['Notepad'=> new NotepadResource($notes)], 'Notepad Created Successfully');
    }

    
    public function show(string $id): JsonResponse
    {
        $notes = Notepad::where('user_id', auth()->id())->find($id);

        if(!$notes){
            return $this->sendError("Notepad not found", ['error'=>['Notepad not found']]);
        }
        //  $project->load('users');
        return $this->sendResponse(["Notepad"=> new NotepadResource($notes)], "Notepad retrived successfully");
    }

    
    public function update(Request $request, string $id): JsonResponse
    {
        $notes = Notepad::where('user_id', auth()->id())->find($id);
        
        if(!$notes){
            return $this->sendError("Notepad not found", ['error'=>['Notepad not found']]);
        }
        
        $notes->note_title = $request->input("note_title");
        $notes->note_content = $request->input("note_content");
        $notes->note_color = $request->input("note_color");
        $notes->save();
        
        return $this->sendResponse(["Notepad"=> new NotepadResource($notes)], "Notepad Updated successfully");

    }

    /**
     * Delete Notepad
     */
    public function destroy(string $id): JsonResponse
    {
        $notes = Notepad::where('user_id', auth()->id())->find($id);
        
        if(!$notes){
            return $this->sendError("note not found", ['error'=>'Note not found']);
        }

        $notes->delete();

        return $this->sendResponse([], "Note deleted successfully");
    }

    /**
     * Fetch All Notepad.
     */
    public function allNotes(): JsonResponse
    {
        $notes = Notepad::where('user_id', auth()->id())->get();

        return $this->sendResponse(["Notepad"=>NotepadResource::collection($notes),
        ], "Notepad retrieved successfully");

    }
   
   
}