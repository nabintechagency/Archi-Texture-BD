<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Media;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_project_can_have_many_skills(): void
    {
        $project = Project::create(['title' => 'Portfolio', 'slug' => 'portfolio']);
        $skill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $project->skills()->attach($skill);

        $this->assertTrue($project->skills->contains($skill));
        $this->assertTrue($skill->projects->contains($project));
    }

    public function test_a_blog_post_and_media_item_belong_to_a_user(): void
    {
        $user = User::factory()->create();
        $post = BlogPost::create([
            'author_id' => $user->id,
            'title' => 'First post',
            'slug' => 'first-post',
            'content' => 'Post content',
        ]);
        $media = Media::create([
            'uploaded_by' => $user->id,
            'filename' => 'photo.jpg',
            'original_filename' => 'photo.jpg',
            'path' => 'media/photo.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
        ]);

        $this->assertTrue($post->author->is($user));
        $this->assertTrue($media->uploader->is($user));
        $this->assertTrue($user->blogPosts->contains($post));
        $this->assertTrue($user->uploadedMedia->contains($media));
    }
}
