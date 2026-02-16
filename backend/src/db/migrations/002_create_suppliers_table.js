/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('suppliers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('company_name').notNullable();
    table.text('description');
    table.specificType('service_areas', 'geometry(POLYGON, 4326)');
    table.decimal('rating', 3, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('suppliers');
};
