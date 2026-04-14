<?php

namespace App\Http\Controllers\Api;

use App\Models\LeadSource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadSourceResource;
use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\StoreLeadSourceRequest;
use App\Http\Requests\UpdateLeadSourceRequest;

/**
 * @group Lead Source Management
 */
class LeadSourceController extends BaseController
{
    /**
     * All Lead Sources.
     */
    public function index(Request $request): JsonResponse
    {
        $query = LeadSource::query();

        if ($request->query('search')) {
            $searchTerm = $request->query('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('source_title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('source_name', 'like', '%' . $searchTerm . '%');
            });
        }

        $leadSources = $query->orderBy("id", "DESC")->paginate(9);

        return $this->sendResponse([
            "LeadSources" => LeadSourceResource::collection($leadSources),
            'Pagination' => [
                'current_page' => $leadSources->currentPage(),
                'last_page' => $leadSources->lastPage(),
                'per_page' => $leadSources->perPage(),
                'total' => $leadSources->total(),
            ]
        ], "Lead Sources retrieved successfully");
    }

    /**
     * Store Lead Source.
     */
    public function store(StoreLeadSourceRequest $request): JsonResponse
    {
        $leadSource = new LeadSource();
        $leadSource->source_title = $request->input("source_title");
        $leadSource->source_name = $request->input("source_name");
        $leadSource->save();

        return $this->sendResponse(['LeadSource' => new LeadSourceResource($leadSource)], 'Lead Source Created Successfully');
    }

    /**
     * Show Lead Source.
     */
    public function show(string $id): JsonResponse
    {
        $leadSource = LeadSource::find($id);

        if (!$leadSource) {
            return $this->sendError("Lead Source not found", ['error' => ['Lead Source not found']]);
        }

        return $this->sendResponse(["LeadSource" => new LeadSourceResource($leadSource)], "Lead Source retrieved successfully");
    }

    /**
     * Update Lead Source.
     */
    public function update(UpdateLeadSourceRequest $request, string $id): JsonResponse
    {
        $leadSource = LeadSource::find($id);
        if (!$leadSource) {
            return $this->sendError("Lead Source not found", ['error' => ['Lead Source not found']]);
        }
        $leadSource->source_title = $request->input('source_title');
        $leadSource->source_name = $request->input('source_name');
        $leadSource->save();

        return $this->sendResponse(["LeadSource" => new LeadSourceResource($leadSource)], "Lead Source Updated successfully");
    }

    /**
     * Delete Lead Source.
     */
    public function destroy(string $id): JsonResponse
    {
        $leadSource = LeadSource::find($id);
        if (!$leadSource) {
            return $this->sendError("Lead Source not found", ['error' => 'Lead Source not found']);
        }

        $leadSource->delete();

        return $this->sendResponse([], "Lead Source deleted successfully");
    }

    /**
     * Fetch All Lead Sources for dropdown.
     */
    public function allLeadSources(): JsonResponse
    {
        $leadSources = LeadSource::all();

        return $this->sendResponse([
            "LeadSources" => LeadSourceResource::collection($leadSources),
        ], "Lead Sources retrieved successfully");
    }
}
