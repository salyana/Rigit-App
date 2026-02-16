/**
 * Add password_hash for local auth; make supabase_id optional (no longer using Supabase)
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      table.text('password_hash');
    })
    .then(() => knex.raw('ALTER TABLE users ALTER COLUMN supabase_id DROP NOT NULL'));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('password_hash');
  }).then(() => knex.raw('ALTER TABLE users ALTER COLUMN supabase_id SET NOT NULL'));
};
