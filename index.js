const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'marvel',
  password: 'ds564',
  port: 7007,
});


app.use(express.json());

app.get("/batalha/:heroi1id/:heroi2id", async (req, res) => {
  const { heroi1id, heroi2id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM herois WHERE id = $1 OR id = $2', [heroi1id, heroi2id]);
    res.send(rows);
  } catch (error) {
    res.status(500).send('Erro ao buscar herois');
  }

}
);

const batalhaFunc = (heroi1, heroi2) => {
  if (heroi1.dano > heroi2.dano) {
    return heroi1.id;
  } else if (heroi2.dano > heroi1.dano) {
    return heroi2.id;
  }
  else {
    return "empate";
  }
}


app.get("/winner/:id1/:id2", async (req, res) => {
  const { id1, id2 } = req.params;
  const hero1 = await pool.query('SELECT * FROM herois WHERE id = $1', [id1]);
  const hero2 = await pool.query('SELECT * FROM herois WHERE id = $1', [id2]);
  const battle = await batalhaFunc(hero1.rows[0], hero2.rows[0]);
  await pool.query('INSERT INTO batalhas (hero1_id, hero2_id, winner_id) VALUES ($1, $2, $3)', [hero1.rows[0].id, hero2.rows[0].id, battle])
  res.json({
    message: `o vencedor é:${battle}`,

  });
}
);

app.get("/historico", async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM batalhas');
    res.json({
      total: resultado.rowCount,
      batalhas: resultado.rows,
    });
  } catch (error) {
    res.status(500).send('Erro ao buscar histórico');
  }
});

app.get('/herois', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM herois');
    res.send(rows);
  } catch (error) {
    res.status(500).send('Erro ao buscar herois');
  }

}
);

// app.get('/batalhaheroi', async (req, res) => {
//   try {
//     const resultado = await pool.query('SELECT batalhas.id')
//   }
  
// })

app.get('/herois/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM herois WHERE id = $1', [id]);
    res.send(rows);
  } catch (error) {
    res.status(500).send('Erro ao buscar heroi');
  }
});

app.post('/herois', async (req, res) => {
  const { name, power, level, dano, hp } = req.body;
  try {
    await pool.query('INSERT INTO herois (name, power, level, dano, hp) VALUES ($1, $2, $3, $4, $5)', [name, power, level, dano, hp]);
    res.send('Heroi adicionado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao adicionar heroi');
  }
}
);

app.put('/herois/:id', async (req, res) => {
  const { id } = req.params;
  const { name, power, level, dano, hp } = req.body;
  try {
    await pool.query('UPDATE herois SET name = $1, power = $2, level = $3, dano = $4, hp = $5 WHERE id = $6', [name, power, level, dano, hp, id]);
    res.send('Heroi atualizado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao atualizar heroi');
  }
}
);

app.delete('/herois/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM herois WHERE id = $1', [id]);
    res.send('Heroi deletado com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao deletar heroi');
  }
}
);

















app.get('/', (req, res) => {
  res.send('Bem-vindo ao meu app!');
});






















app.listen(PORT, () => {
  console.log(`Servidor esta rodando na porta ${PORT}`);
});
