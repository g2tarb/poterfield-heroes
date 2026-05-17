CREATE TYPE "public"."coach_role" AS ENUM('user', 'assistant', 'system', 'tool_call', 'tool_result');--> statement-breakpoint
CREATE TYPE "public"."code_review_severity" AS ENUM('info', 'suggestion', 'warning', 'critical');--> statement-breakpoint
CREATE TYPE "public"."exercise_kind" AS ENUM('quiz_activation', 'quiz_verification', 'code_exercise', 'project_validation');--> statement-breakpoint
CREATE TYPE "public"."memory_source" AS ENUM('error', 'note', 'exercise', 'exam', 'code_push', 'summary');--> statement-breakpoint
CREATE TYPE "public"."module_status" AS ENUM('locked', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."notebook_source" AS ENUM('coach', 'user', 'system');--> statement-breakpoint
CREATE TYPE "public"."notification_kind" AS ENUM('srs_due', 'weekly_exam', 'streak_at_risk', 'level_up', 'coach_proactive', 'github_review_ready', 'module_unlocked');--> statement-breakpoint
CREATE TYPE "public"."programming_language" AS ENUM('html', 'css', 'javascript', 'typescript', 'jsx', 'tsx', 'python', 'sql', 'bash', 'glsl', 'json', 'markdown', 'plaintext');--> statement-breakpoint
CREATE TYPE "public"."sandbox_kind" AS ENUM('browser', 'docker', 'external');--> statement-breakpoint
CREATE TYPE "public"."skill_status" AS ENUM('discovering', 'practicing', 'mastered');--> statement-breakpoint
CREATE TYPE "public"."srs_card_state" AS ENUM('new', 'learning', 'review', 'mature', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."xp_event_kind" AS ENUM('module_completed', 'skill_mastered', 'exam_passed', 'exam_perfect', 'streak_milestone', 'project_validated', 'github_push_reviewed');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar(64) NOT NULL,
	"kind" "exercise_kind" NOT NULL,
	"sandbox" "sandbox_kind" DEFAULT 'browser' NOT NULL,
	"language" "programming_language",
	"title" text NOT NULL,
	"statement" text NOT NULL,
	"starter_code" text,
	"solution_code" text,
	"expected_output" text,
	"tests_code" text,
	"quiz_questions" jsonb,
	"skill_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pass_threshold_pct" integer DEFAULT 80 NOT NULL,
	"estimated_minutes" integer,
	"display_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" integer PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"icon" varchar(8),
	"xp_required" integer NOT NULL,
	"description" text NOT NULL,
	"project_examples" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levels_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mastery_axes" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"label" varchar(80) NOT NULL,
	"description" text NOT NULL,
	"color_hex" varchar(7) NOT NULL,
	"display_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"module_number" integer NOT NULL,
	"phase" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"subtitle" varchar(300),
	"pourquoi" text NOT NULL,
	"objectives" jsonb NOT NULL,
	"prerequisites" text,
	"estimated_hours" integer NOT NULL,
	"estimated_weeks" integer,
	"stack_allowed" jsonb,
	"prereq_module_id" varchar(64),
	"unlock_srs_mature_ratio" integer DEFAULT 80 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "modules_module_number_unique" UNIQUE("module_number")
);
--> statement-breakpoint
CREATE TABLE "skill_axes" (
	"skill_id" uuid NOT NULL,
	"axis_id" varchar(32) NOT NULL,
	"contribution" integer DEFAULT 100 NOT NULL,
	CONSTRAINT "skill_axes_skill_id_axis_id_pk" PRIMARY KEY("skill_id","axis_id")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar(64) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar(64) NOT NULL,
	"is_primary" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"creator" varchar(160),
	"youtube_id" varchar(32),
	"external_url" text,
	"language" varchar(8) DEFAULT 'en' NOT NULL,
	"duration_seconds" integer,
	"start_seconds" integer,
	"end_seconds" integer,
	"why_this_one" text,
	"covers_skills" jsonb,
	"display_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exercise_id" uuid NOT NULL,
	"attempt_number" integer NOT NULL,
	"submitted_code" text,
	"quiz_answers" jsonb,
	"score_pct" integer,
	"passed" boolean DEFAULT false NOT NULL,
	"duration_ms" integer,
	"run_output" text,
	"run_error" text,
	"started_at" timestamp with time zone NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module_progress" (
	"module_id" varchar(64) PRIMARY KEY NOT NULL,
	"status" "module_status" DEFAULT 'locked' NOT NULL,
	"unlocked_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"seconds_spent" integer DEFAULT 0 NOT NULL,
	"current_step_key" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "skill_progress" (
	"skill_id" uuid PRIMARY KEY NOT NULL,
	"status" "skill_status" DEFAULT 'discovering' NOT NULL,
	"mastery_pct" integer DEFAULT 0 NOT NULL,
	"srs_mature_at" timestamp with time zone,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mastered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "video_progress" (
	"video_id" uuid PRIMARY KEY NOT NULL,
	"last_position_seconds" integer DEFAULT 0 NOT NULL,
	"watched_seconds" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"checkpoints" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "srs_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_id" uuid NOT NULL,
	"module_id" varchar(64) NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"answer_keywords" jsonb,
	"state" "srs_card_state" DEFAULT 'new' NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"interval_days" integer DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"last_review_at" timestamp with time zone,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "srs_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"elapsed_days" real NOT NULL,
	"scheduled_days" real NOT NULL,
	"stability_before" real NOT NULL,
	"stability_after" real NOT NULL,
	"difficulty_before" real NOT NULL,
	"difficulty_after" real NOT NULL,
	"duration_ms" integer,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notebook_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar(64),
	"skill_id" uuid,
	"source" "notebook_source" NOT NULL,
	"title" text NOT NULL,
	"content_markdown" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"starred" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"role" "coach_role" NOT NULL,
	"content" text NOT NULL,
	"tool_name" varchar(64),
	"tool_input" jsonb,
	"tool_output" jsonb,
	"model" varchar(64),
	"input_tokens" integer,
	"output_tokens" integer,
	"cached_tokens" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar(64),
	"title" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"total_input_tokens" integer DEFAULT 0 NOT NULL,
	"total_output_tokens" integer DEFAULT 0 NOT NULL,
	"total_cost_cents" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "memory_source" NOT NULL,
	"source_id" uuid,
	"module_id" varchar(64),
	"exercise_id" uuid,
	"content" text NOT NULL,
	"content_summary" text,
	"metadata" jsonb,
	"embedding" vector(1024) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "code_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"push_id" uuid NOT NULL,
	"overall_severity" "code_review_severity" DEFAULT 'info' NOT NULL,
	"overall_summary" text NOT NULL,
	"annotations" jsonb NOT NULL,
	"criteria_scores" jsonb,
	"model" varchar(64),
	"input_tokens" integer,
	"output_tokens" integer,
	"cost_cents" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "github_pushes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repo_id" uuid NOT NULL,
	"branch" varchar(80) NOT NULL,
	"head_sha" varchar(40) NOT NULL,
	"before_sha" varchar(40),
	"commits_count" integer DEFAULT 1 NOT NULL,
	"commits_payload" jsonb,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"review_started_at" timestamp with time zone,
	"review_completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "github_repos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"full_name" varchar(320) NOT NULL,
	"module_id" varchar(64),
	"purpose" varchar(80),
	"default_branch" varchar(80) DEFAULT 'main' NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "github_repos_full_name_unique" UNIQUE("full_name")
);
--> statement-breakpoint
CREATE TABLE "exam_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"answers" jsonb NOT NULL,
	"score_pct" integer NOT NULL,
	"duration_seconds" integer NOT NULL,
	"feedback" text,
	"cards_reset" jsonb,
	"started_at" timestamp with time zone NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_start_date" text NOT NULL,
	"module_ids_covered" jsonb NOT NULL,
	"skill_ids_covered" jsonb NOT NULL,
	"questions" jsonb NOT NULL,
	"time_limit_minutes" integer DEFAULT 60 NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"generation_model" text,
	"generation_cost_cents" integer,
	CONSTRAINT "weekly_exams_week_start_date_unique" UNIQUE("week_start_date")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "notification_kind" NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"href" text,
	"scheduled_for" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"push_sent" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"slug" varchar(80) NOT NULL,
	"bio" text,
	"tagline" varchar(200),
	"pitch_markdown" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"show_radar" boolean DEFAULT true NOT NULL,
	"show_streak" boolean DEFAULT true NOT NULL,
	"show_stack" boolean DEFAULT true NOT NULL,
	"show_projects" boolean DEFAULT false NOT NULL,
	"custom_accent_hex" varchar(7),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "public_profile_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"failure_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "user_state" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"email" varchar(255),
	"avatar_url" text,
	"current_xp" integer DEFAULT 0 NOT NULL,
	"current_level_id" integer,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_active_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"target_completion_date" timestamp with time zone,
	"preferences" jsonb
);
--> statement-breakpoint
CREATE TABLE "xp_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "xp_event_kind" NOT NULL,
	"xp_amount" integer NOT NULL,
	"source_ref" text,
	"metadata" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_prereq_module_id_modules_id_fk" FOREIGN KEY ("prereq_module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_axes" ADD CONSTRAINT "skill_axes_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_axes" ADD CONSTRAINT "skill_axes_axis_id_mastery_axes_id_fk" FOREIGN KEY ("axis_id") REFERENCES "public"."mastery_axes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_progress" ADD CONSTRAINT "skill_progress_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_progress" ADD CONSTRAINT "video_progress_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "srs_cards" ADD CONSTRAINT "srs_cards_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "srs_cards" ADD CONSTRAINT "srs_cards_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "srs_reviews" ADD CONSTRAINT "srs_reviews_card_id_srs_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."srs_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notebook_entries" ADD CONSTRAINT "notebook_entries_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notebook_entries" ADD CONSTRAINT "notebook_entries_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_messages" ADD CONSTRAINT "coach_messages_session_id_coach_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."coach_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_sessions" ADD CONSTRAINT "coach_sessions_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_embeddings" ADD CONSTRAINT "memory_embeddings_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_embeddings" ADD CONSTRAINT "memory_embeddings_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_reviews" ADD CONSTRAINT "code_reviews_push_id_github_pushes_id_fk" FOREIGN KEY ("push_id") REFERENCES "public"."github_pushes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_pushes" ADD CONSTRAINT "github_pushes_repo_id_github_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."github_repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "github_repos" ADD CONSTRAINT "github_repos_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_submissions" ADD CONSTRAINT "exam_submissions_exam_id_weekly_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."weekly_exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_state" ADD CONSTRAINT "user_state_current_level_id_levels_id_fk" FOREIGN KEY ("current_level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_exercises_module" ON "exercises" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_exercises_kind" ON "exercises" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "idx_modules_number" ON "modules" USING btree ("module_number");--> statement-breakpoint
CREATE INDEX "idx_modules_phase" ON "modules" USING btree ("phase");--> statement-breakpoint
CREATE INDEX "idx_skills_module" ON "skills" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "uq_skills_module_slug" ON "skills" USING btree ("module_id","slug");--> statement-breakpoint
CREATE INDEX "idx_videos_module" ON "videos" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_attempts_exercise" ON "exercise_attempts" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "idx_attempts_passed" ON "exercise_attempts" USING btree ("passed");--> statement-breakpoint
CREATE INDEX "idx_module_progress_status" ON "module_progress" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_skill_progress_status" ON "skill_progress" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_srs_cards_due" ON "srs_cards" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "idx_srs_cards_state" ON "srs_cards" USING btree ("state");--> statement-breakpoint
CREATE INDEX "idx_srs_cards_skill" ON "srs_cards" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "idx_srs_cards_module" ON "srs_cards" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_srs_reviews_card" ON "srs_reviews" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "idx_srs_reviews_at" ON "srs_reviews" USING btree ("reviewed_at");--> statement-breakpoint
CREATE INDEX "idx_notebook_module" ON "notebook_entries" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_notebook_source" ON "notebook_entries" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_notebook_starred" ON "notebook_entries" USING btree ("starred");--> statement-breakpoint
CREATE INDEX "idx_coach_messages_session" ON "coach_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_coach_sessions_module" ON "coach_sessions" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_coach_sessions_last_msg" ON "coach_sessions" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "idx_memory_source" ON "memory_embeddings" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_memory_module" ON "memory_embeddings" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_memory_embedding_hnsw" ON "memory_embeddings" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_reviews_push" ON "code_reviews" USING btree ("push_id");--> statement-breakpoint
CREATE INDEX "idx_pushes_repo" ON "github_pushes" USING btree ("repo_id");--> statement-breakpoint
CREATE INDEX "idx_pushes_detected" ON "github_pushes" USING btree ("detected_at");--> statement-breakpoint
CREATE INDEX "idx_repos_module" ON "github_repos" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_exam" ON "exam_submissions" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "idx_exams_week" ON "weekly_exams" USING btree ("week_start_date");--> statement-breakpoint
CREATE INDEX "idx_notif_scheduled" ON "notifications" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "idx_notif_sent" ON "notifications" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "idx_notif_kind" ON "notifications" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "idx_xp_kind" ON "xp_events" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "idx_xp_occurred" ON "xp_events" USING btree ("occurred_at");