<?php

namespace App\Http\Controllers\Api;

use App\Models\BlogPost;
use App\Models\Certification;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Media;
use App\Models\Message;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\Slider;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContentController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $resource = $this->resource($request);
        $perPage = min(max((int) $request->integer('per_page', 15), 1), 100);

        return $this->successResponse(
            $resource['model']::query()->with($resource['with'])->orderBy($resource['order_by'], $resource['order_direction'] ?? 'asc')->paginate($perPage),
        );
    }

    public function store(Request $request): JsonResponse
    {
        $resource = $this->resource($request);
        $validated = $request->validate($resource['rules']);
        $model = $resource['model']::create($this->attributesFor($request, $resource, $validated));

        $this->syncRelations($model, $validated);

        return $this->successResponse($model->fresh($resource['with']), 'Created successfully.', 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $resource = $this->resource($request);

        return $this->successResponse($resource['model']::with($resource['with'])->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $resource = $this->resource($request);
        $model = $resource['model']::findOrFail($id);
        $validated = $request->validate($this->updateRules($resource['rules'], $model));

        $model->update($this->attributesFor($request, $resource, $validated));
        $this->syncRelations($model, $validated);

        return $this->successResponse($model->fresh($resource['with']), 'Updated successfully.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $resource = $this->resource($request);
        $resource['model']::findOrFail($id)->delete();

        return $this->successResponse(message: 'Deleted successfully.');
    }

    /** @return array{model: class-string<Model>, rules: array<string, array<int, mixed>>, with: array<int, string>, order_by: string, owner?: string} */
    private function resource(Request $request): array
    {
        $resources = [
            'projects' => ['model' => Project::class, 'with' => ['skills'], 'order_by' => 'sort_order', 'rules' => [
                'title' => ['required', 'string', 'max:255'], 'slug' => ['required', 'string', 'max:255', 'unique:projects,slug'],
                'summary' => ['nullable', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'featured_image' => ['nullable', 'string', 'max:255'],
                'project_url' => ['nullable', 'url', 'max:255'], 'repository_url' => ['nullable', 'url', 'max:255'], 'technologies' => ['nullable', 'array'],
                'status' => ['required', Rule::in(['draft', 'published', 'archived'])], 'is_featured' => ['boolean'], 'completed_at' => ['nullable', 'date'],
                'sort_order' => ['integer', 'min:0'], 'skills' => ['sometimes', 'array'], 'skills.*' => ['integer', 'exists:skills,id'],
            ]],
            'skills' => ['model' => Skill::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'name' => ['required', 'string', 'max:255'], 'slug' => ['required', 'string', 'max:255', 'unique:skills,slug'], 'category' => ['nullable', 'string', 'max:255'],
                'proficiency' => ['nullable', 'integer', 'between:0,100'], 'icon' => ['nullable', 'string', 'max:255'], 'sort_order' => ['integer', 'min:0'], 'is_active' => ['boolean'],
            ]],
            'services' => ['model' => Service::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'title' => ['required', 'string', 'max:255'], 'slug' => ['required', 'string', 'max:255', 'unique:services,slug'], 'summary' => ['nullable', 'string', 'max:255'],
                'description' => ['nullable', 'string'], 'icon' => ['nullable', 'string', 'max:255'], 'sort_order' => ['integer', 'min:0'], 'is_active' => ['boolean'],
            ]],
            'experiences' => ['model' => Experience::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'company' => ['required', 'string', 'max:255'], 'job_title' => ['required', 'string', 'max:255'], 'employment_type' => ['nullable', 'string', 'max:255'],
                'location' => ['nullable', 'string', 'max:255'], 'started_at' => ['required', 'date'], 'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
                'is_current' => ['boolean'], 'description' => ['nullable', 'string'], 'sort_order' => ['integer', 'min:0'],
            ]],
            'education' => ['model' => Education::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'institution' => ['required', 'string', 'max:255'], 'degree' => ['required', 'string', 'max:255'], 'field_of_study' => ['nullable', 'string', 'max:255'],
                'location' => ['nullable', 'string', 'max:255'], 'started_at' => ['nullable', 'date'], 'ended_at' => ['nullable', 'date', 'after_or_equal:started_at'],
                'description' => ['nullable', 'string'], 'sort_order' => ['integer', 'min:0'],
            ]],
            'certifications' => ['model' => Certification::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'name' => ['required', 'string', 'max:255'], 'issuer' => ['required', 'string', 'max:255'], 'credential_id' => ['nullable', 'string', 'max:255'],
                'credential_url' => ['nullable', 'url', 'max:255'], 'issued_at' => ['nullable', 'date'], 'expires_at' => ['nullable', 'date', 'after_or_equal:issued_at'],
                'image_path' => ['nullable', 'string', 'max:255'], 'sort_order' => ['integer', 'min:0'],
            ]],
            'testimonials' => ['model' => Testimonial::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'author_name' => ['required', 'string', 'max:255'], 'author_role' => ['nullable', 'string', 'max:255'], 'company' => ['nullable', 'string', 'max:255'],
                'content' => ['required', 'string'], 'avatar_path' => ['nullable', 'string', 'max:255'], 'rating' => ['nullable', 'integer', 'between:1,5'],
                'is_featured' => ['boolean'], 'sort_order' => ['integer', 'min:0'],
            ]],
            'blog-posts' => ['model' => BlogPost::class, 'with' => ['author'], 'order_by' => 'published_at', 'order_direction' => 'desc', 'owner' => 'author_id', 'rules' => [
                'title' => ['required', 'string', 'max:255'], 'slug' => ['required', 'string', 'max:255', 'unique:blog_posts,slug'], 'excerpt' => ['nullable', 'string'],
                'content' => ['required', 'string'], 'featured_image' => ['nullable', 'string', 'max:255'], 'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
                'published_at' => ['nullable', 'date'], 'seo_title' => ['nullable', 'string', 'max:255'], 'seo_description' => ['nullable', 'string'],
            ]],
            'media' => ['model' => Media::class, 'with' => ['uploader'], 'order_by' => 'id', 'owner' => 'uploaded_by', 'rules' => [
                'filename' => ['required', 'string', 'max:255'], 'original_filename' => ['required', 'string', 'max:255'], 'path' => ['required', 'string', 'max:255', 'unique:media,path'],
                'disk' => ['string', 'max:255'], 'mime_type' => ['required', 'string', 'max:255'], 'size' => ['required', 'integer', 'min:0'], 'alt_text' => ['nullable', 'string', 'max:255'],
                'caption' => ['nullable', 'string'], 'folder' => ['nullable', 'string', 'max:255'],
            ]],
            'messages' => ['model' => Message::class, 'with' => [], 'order_by' => 'id', 'rules' => [
                'name' => ['required', 'string', 'max:255'], 'email' => ['required', 'email', 'max:255'], 'subject' => ['nullable', 'string', 'max:255'],
                'message' => ['required', 'string'], 'is_read' => ['boolean'], 'read_at' => ['nullable', 'date'],
            ]],
            'settings' => ['model' => Setting::class, 'with' => [], 'order_by' => 'key', 'rules' => [
                'key' => ['required', 'string', 'max:255', 'unique:settings,key'], 'value' => ['nullable', 'array'], 'group' => ['string', 'max:255'],
            ]],
            'sliders' => ['model' => Slider::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'title' => ['required', 'string', 'max:255'], 'subtitle' => ['nullable', 'string', 'max:255'],
                'description' => ['nullable', 'string'], 'image' => ['nullable', 'string', 'max:255'],
                'link_url' => ['nullable', 'url', 'max:255'], 'link_text' => ['nullable', 'string', 'max:255'],
                'text_position' => ['string', 'max:255'], 'text_color' => ['string', 'max:7'],
                'overlay_opacity' => ['integer', 'between:0,100'], 'status' => ['boolean'], 'sort_order' => ['integer', 'min:0'],
            ]],
            'products' => ['model' => Product::class, 'with' => [], 'order_by' => 'sort_order', 'rules' => [
                'name' => ['required', 'string', 'max:255'], 'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
                'summary' => ['nullable', 'string', 'max:255'], 'description' => ['nullable', 'string'],
                'featured_image' => ['nullable', 'string', 'max:255'], 'gallery' => ['nullable', 'array'],
                'price' => ['nullable', 'numeric', 'min:0'], 'category' => ['nullable', 'string', 'max:255'],
                'sku' => ['nullable', 'string', 'max:255'], 'stock_quantity' => ['integer', 'min:0'],
                'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
                'is_featured' => ['boolean'], 'sort_order' => ['integer', 'min:0'],
            ]],
        ];

        $resourceKey = $request->route('resource') ?? $request->segment(2);

        abort_unless(isset($resources[$resourceKey]), 404);

        return $resources[$resourceKey];
    }

    /** @param array<string, array<int, mixed>> $rules */
    private function updateRules(array $rules, Model $model): array
    {
        foreach ($rules as $field => $fieldRules) {
            $rules[$field] = array_map(function (mixed $rule) use ($model): mixed {
                if (is_string($rule) && str_starts_with($rule, 'unique:')) {
                    [, $table, $column] = explode(':', str_replace(',', ':', $rule), 3);

                    return Rule::unique($table, $column)->ignore($model);
                }

                return $rule;
            }, $fieldRules);

            if ($field !== 'skills' && $field !== 'skills.*') {
                array_unshift($rules[$field], 'sometimes');
            }
        }

        return $rules;
    }

    /** @param array{owner?: string} $resource @param array<string, mixed> $validated */
    private function attributesFor(Request $request, array $resource, array $validated): array
    {
        unset($validated['skills']);

        if (isset($resource['owner'])) {
            $validated[$resource['owner']] = $request->user()->id;
        }

        return $validated;
    }

    /** @param array<string, mixed> $validated */
    private function syncRelations(Model $model, array $validated): void
    {
        if ($model instanceof Project && array_key_exists('skills', $validated)) {
            $model->skills()->sync($validated['skills']);
        }
    }
}
