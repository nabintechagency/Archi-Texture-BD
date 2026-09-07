<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file'   => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,svg,pdf,mp4,mov,avi'],
            'folder' => ['nullable', 'string', 'max:255'],
        ]);

        $file     = $request->file('file');
        $folder   = $request->input('folder', 'uploads');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs($folder, $filename, 'public');

        $media = Media::create([
            'filename'          => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'path'              => $path,
            'disk'              => 'public',
            'mime_type'         => $file->getMimeType(),
            'size'              => $file->getSize(),
            'folder'            => $folder,
            'uploaded_by'       => $request->user()?->id,
        ]);

        return response()->json([
            'success' => true,
            'data'    => array_merge($media->toArray(), [
                'url' => Storage::disk('public')->url($path),
            ]),
        ], 201);
    }

    public function destroy(Media $media): JsonResponse
    {
        Storage::disk($media->disk)->delete($media->path);
        $media->delete();

        return response()->json(['success' => true, 'message' => 'Deleted successfully.']);
    }
}
