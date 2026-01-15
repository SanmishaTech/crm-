<?php

namespace App\Http\Controllers\Api;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\EventResource;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Controllers\Api\BaseController;

class EventsController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::query()->with(['createdBy']);

        if ($request->query('lead_id')) {
            $query->where('lead_id', $request->query('lead_id'));
        }

        if ($request->query('event_date')) {
            $query->whereDate('event_datetime', $request->query('event_date'));
        }

        $events = $query->orderBy('id', 'DESC')->paginate(20);

        return $this->sendResponse([
            'Events' => EventResource::collection($events),
            'pagination' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ],
        ], 'Events retrieved successfully');
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $event = new Event();
        $event->lead_id = $request->input('lead_id');
        $event->event_datetime = $request->input('event_datetime');
        $event->team_user_ids = $request->input('team_user_ids');
        $event->participants = $request->input('participants');
        $event->created_by = Auth::id();
        $event->save();

        $event->load(['createdBy']);

        return $this->sendResponse(['Event' => new EventResource($event)], 'Event Created Successfully');
    }

    public function show(string $id): JsonResponse
    {
        $event = Event::with(['createdBy'])->find($id);

        if (!$event) {
            return $this->sendError('Event not found', ['error' => ['Event not found']]);
        }

        return $this->sendResponse(['Event' => new EventResource($event)], 'Event retrieved successfully');
    }

    public function update(UpdateEventRequest $request, string $id): JsonResponse
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->sendError('Event not found', ['error' => ['Event not found']]);
        }

        if ($request->has('event_datetime')) {
            $event->event_datetime = $request->input('event_datetime');
        }

        if ($request->has('team_user_ids')) {
            $event->team_user_ids = $request->input('team_user_ids');
        }

        if ($request->has('participants')) {
            $event->participants = $request->input('participants');
        }

        $event->save();
        $event->load(['createdBy']);

        return $this->sendResponse(['Event' => new EventResource($event)], 'Event updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->sendError('Event not found', ['error' => ['Event not found']]);
        }

        $event->delete();

        return $this->sendResponse([], 'Event deleted successfully');
    }
}
