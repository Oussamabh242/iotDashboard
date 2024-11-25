-- name: GetUser :one
SELECT * FROM users
WHERE email = ? LIMIT 1;

-- name: CreateUser :one
INSERT INTO users(
  name , email , password
) VALUES (
  ?    ,  ?    ,   ?
)
RETURNING *;

-- name: GetUserProjects :many
SELECT p.id ,p.name, p.owner  
FROM projects p 
WHERE p.owner = ? ;

-- name: CreateProject :one
INSERT INTO projects(
  name , owner
)  VALUES (
  ?    ,  ?   
)
RETURNING *;

