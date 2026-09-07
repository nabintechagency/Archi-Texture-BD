<?php

namespace Tests\Feature\Api;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_content_routes_require_authentication(): void
    {
        $this->getJson('/api/skills')
            ->assertUnauthorized()
            ->assertJsonPath('success', false);
    }

    public function test_a_skill_can_be_created_read_updated_and_deleted(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $created = $this->postJson('/api/skills', [
            'name' => 'Laravel',
            'slug' => 'laravel',
            'category' => 'Backend',
            'proficiency' => 90,
        ])->assertCreated()
            ->assertJsonPath('data.name', 'Laravel');

        $skillId = $created->json('data.id');

        $this->getJson("/api/skills/{$skillId}")
            ->assertOk()
            ->assertJsonPath('data.slug', 'laravel');

        $this->putJson("/api/skills/{$skillId}", ['proficiency' => 95])
            ->assertOk()
            ->assertJsonPath('data.proficiency', 95);

        $this->deleteJson("/api/skills/{$skillId}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('skills', ['id' => $skillId]);
    }

    public function test_a_project_can_sync_its_skills(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $skill = Skill::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $this->postJson('/api/projects', [
            'title' => 'Portfolio',
            'slug' => 'portfolio',
            'status' => 'published',
            'skills' => [$skill->id],
        ])->assertCreated()
            ->assertJsonPath('data.skills.0.id', $skill->id);
    }
}
