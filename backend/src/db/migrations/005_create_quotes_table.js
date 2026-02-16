/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('quotes', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.uuid('supplier_id').references('id').inTable('suppliers').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.enum('status', ['pending', 'accepted', 'rejected', 'expired']).defaultTo('pending');
    table.timestamp('valid_until');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('project_id');
    table.index('supplier_id');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('quotes');
};
